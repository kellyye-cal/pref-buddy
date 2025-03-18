import React from 'react';
import TopNav from './TopNav';

function Contributions() {
    return (
        <div>
            <TopNav />
            <div className="public-main">
                <h1> 🤝 Contribute to PrefBuddy </h1>

                <div>
                    <h2> 🔍 Identifying Rounds </h2>
                    <p>
                        I'm scraping rounds from the 2024-2025 bid tournaments right now. From Tabroom, I am able to
                        gather win results & speaker points, but I need help identifying round types (Policy vs. Policy, K vs. K, etc). 
                    </p>

                    <p> You can visit this spreadsheet and add a comment in the "Round Type" field for your round(s).
                        I am identifying the round type as one of five categories:
                        <div style={{marginLeft: 12, marginTop: 8, fontWeight: 500}}>
                            <p> 1️⃣ Policy vs. Policy</p>
                            <p> 2️⃣ Policy vs. K</p>
                            <p> 3️⃣ K vs. Policy</p>
                            <p> 4️⃣ K vs. K</p>
                            <p> 5️⃣ T / Theory </p>
                        </div>
                    </p>
                </div>

                <div>
                    <h2> ☕️ Buy me a Coffee </h2>
                    <p> I am volunteering my time & paying for services like Vercel, Heroku, JawsDB to host this web application.
                        My ultimate goal is to build more features, as outlined here. However, to scale such features to more members of the 
                        community, I need to pay for higher tiers on deployment services. If you want to continue to support this project, please
                        continue contributing on my Buy me a Coffee.
                    </p>
                </div>

                <h2> 🫶🏻 Thank you so much for your help! </h2>
            </div>
        </div>
    )
}

export default Contributions;