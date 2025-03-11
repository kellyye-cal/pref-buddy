const { chromium } = require('playwright');
require('dotenv').config({ path: '../.env.development' });

const tabroomUtils = require('./tabroomUtils')

async function scrapeTournInfo({tournURL, judgesURL}) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(tournURL);
    await page.waitForSelector("h2");

    const name = await page.$eval("h2", el => el.textContent);

    const sidenoteDiv = await page.$$eval('.sidenote', divs => divs[1].innerText);
    const startEndMatch = sidenoteDiv.match(/([A-Za-z]{3}) (\d{1,2})/g);
    const dates = startEndMatch.map(date => {
        const [month, day] = date.split(' ');
        return { month, day };
    });
    
    const year = sidenoteDiv.match(/\d{4}/)[0];

    const startDate = new Date(`${dates[0].month} ${dates[0].day} ${year}`).toISOString().split('T')[0];
    const endDate = new Date(`${dates[1].month} ${dates[1].day} ${year}`).toISOString().split('T')[0];


    const tournIdMatch = tournURL.match(/tourn_id=(\d+)/);
    const tournId = parseInt(tournIdMatch[1]);

    const tournament = {
        id: tournId,
        j_url: judgesURL,
        link: tournURL,
        name: name,
        start_date: startDate,
        end_date: endDate
    }

    await browser.close();
    return tournament;
}

async function scrapeJudges({url}) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector("table");

    const headers = await page.$$eval("table th", ths => ths.map(th => th.innerText.trim().toLowerCase()));

    const col_i = {};
    headers.forEach((header, i) => {
        if (header.includes('first')) {
            col_i['f_name'] = i;
        } else if (header.includes('last')) {
            col_i['l_name'] = i;
        } else if (header.includes('institution')) {
            col_i['institution'] = i;
        }
    })

    const judgeInfo = await page.$$eval('table tbody tr', (rows, colMapping) => {
        return Array.from(rows).map(row => {
            const cols = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
    
            const f_name = cols[colMapping['f_name']] || '';
            const l_name = cols[colMapping['l_name']] || '';
            const affiliation = (cols[colMapping['institution']] || '').replace(/\n|\t/g, '').replace("1", '');
            const paradigmLink = row.querySelector('td a')?.getAttribute('href') || '';
    
            const tab_id = paradigmLink.match(/judge_person_id=(\d+)/)?.[1];
    
            return {
                f_name,
                l_name,
                affiliation,
                paradigm_link: paradigmLink,
                tab_id: tab_id ? parseInt(tab_id) : null
            };
        }).filter(entry => entry !== null);
    }, col_i);

    await browser.close();

    return judgeInfo;
}

async function scrapeTourn({url, u_id}) {
    const t_id = parseInt(url.match(/tourn_id=(\d+)/)[1], 10);
    const tournURL = "https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=" + t_id;

    try {
        /* Scrape tournament info & save to database */
        const tournament = await scrapeTournInfo({tournURL, judgesURL: url});
        tabroomUtils.saveTourn({tournament})

        /* Scrape list of judges at the tournament & save to relevant databases */
        const judges = await scrapeJudges({url})
        await tabroomUtils.saveJudgesToUsers({judges})
        await tabroomUtils.saveJudgesToRanks({judges, u_id})
        await tabroomUtils.saveJudgesToTourn({judges, t_id})
        await tabroomUtils.saveJudgesToJudgeInfo({judges})
        await tabroomUtils.saveUserToAttending({u_id, t_id})
        
        return {status: "success", "data": {"tourn_id": t_id}}
    } catch (error) {
        console.error("Error scraping tournament: ", error);
        return {status: "error", message: error.message};
    }
}

async function scrapeParadigm(id) {
    const paradigmLink = "https://www.tabroom.com/index/paradigm.mhtml?judge_person_id=" + id
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://www.tabroom.com/user/login/login.mhtml");

    const email = page.locator('#login_email');
    await email.fill(process.env.TABROOM_USERNAME);

    const pwd = page.locator('#login_password');
    await pwd.fill(process.env.TABROOM_PASSWORD);
    pwd.press('Enter');

    await page.waitForNavigation();

    await page.goto(paradigmLink)
    await page.waitForSelector(".paradigm>.paradigm")

    const paradigmDivs = await page.$$(".paradigm");
    const paradigmHtml = await paradigmDivs[1].innerHTML();

    await browser.close();

    const paradigm = tabroomUtils.parseHTMLToMD(paradigmHtml);
    tabroomUtils.saveParadigm({id, paradigm});

    return paradigm;
}

async function updateTournament({t_id, j_url}) {
    await tabroomUtils.updateTournTimestamp({t_id});

    const judges = await scrapeJudges(j_url);
    const numJudges = judges.length;
    const numJudgesInDB = tabroomUtils.getNumJudges(t_id);

    if (numJudges !== numJudgesInDB) {
        await tabroomUtils.saveJudgesToUsers({judges});
        await tabroomUtils.saveJudgesToTourn({judges, t_id});
        await tabroomUtils.saveJudgesToJudgeInfo({judges});
    }

    return
}
module.exports = {
    scrapeTourn,
    scrapeParadigm,
    updateTournament
}