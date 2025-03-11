const { chromium } = require('playwright');
require('dotenv').config({ path: '../.env.development' });

async function scrapeParadigm(paradigmLink) {
    const browser = await chromium.launch({ headless: false });
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

}

scrapeParadigm("https://www.tabroom.com/index/paradigm.mhtml?judge_person_id=21548");