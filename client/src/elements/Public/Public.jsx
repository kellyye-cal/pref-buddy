import React from "react";

import "./public.css"
import TopNav from "./TopNav";

function Public() {
    return (
        <div>
            <TopNav />
            <div className="public-main public-home">
                <h1> 👋🏻 Welcome to <span style={{color: "#373C58"}}>Pref</span><span style={{color: "#729AF0"}}>Buddy</span>! </h1>


                <div>
                    <h2> ❓ How to Use </h2>
                    <p>
                        The Tournaments tab will allow you to browse rounds from all 24-25 bid tournaments.
                    </p>

                    <p>
                        The Judges tab will allow you look up stats for any judge who has judged at a 24-25 bid tournament.
                    </p>

                    <p> The Contribute tab has information on how to contribute to this project.
                    </p>
                </div>

                <div>
                    <h2> 📚 Background</h2>
                    <p> This project was inspired by my students at College Prep. They manually collected data from Tabroom
                        on judges, spending hours downloading speaker points results for judges to tiebreak on their pref sheets.
                    </p>

                    <p> I wanted to create a tool that would help them scrape this data automatically, in addition to providing
                        concrete measures of judge philosophies. As a flex team, they have to find judges who are receptive to arguments
                        they read from across the spectrum, so I wanted to help them visualize how judges have voted in the past on various arguments.
                    </p>

                    <p> I already include these stats on my own paradigm, inspired by Debnil Sur. Since not every judge takes the time to calculate
                        this, I thought it would make sense for members of the community to contribute to these stats, similar to round reports on the wiki.
                    </p>
                </div>

                <div>
                    <h2> 👩🏻‍💻 Future Improvements </h2>
                    <p>
                        My ultimate goal is allow people to log in and rate judges. I want each user to be able to track
                        judges across all tournaments that they have attended or plan on attending, and set ratings with ease.

                        Here is my <a target="_blank" href="https://www.figma.com/design/NzjAgbv99iADlHR8EHuFBn/PrefBuddy?node-id=0-1&t=3BJBC34riiYBB2bf-1"> Figma file</a> as a proof of concept.
                    </p>

                    <p>
                        I have already started coding the necessary infrastructure to make this happen. However, I
                        find it will be hard to serve users outside of College Prep on the free tiers of technology that I host my backend on.
                        For now, it will be hard to scale the app to allow more than a certain amount of queries to the database a day.
                    </p>
                </div>

                <div>
                    <h2> 🔗 How I Built This </h2>
                    <p>
                        If you want more insight into how I made this web app,
                        are interested in the tech stack, or just want to read the release notes,
                        visit my <a target="_blank" rel="noreferrer" href="https://github.com/kellyye-cal/pref-buddy"> Github</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Public;