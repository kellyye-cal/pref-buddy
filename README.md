# 📚 Background

This project was inspired by Debnil Sur & my debate students at College Prep. This year, my students spent way too long before tournaments creating their pref sheets.

My students ranked judges based on two factors:
1. How receptive they would be the arguments they would read as a flex team
2. How a judge assigns speaker points relative to the community average.

### 💬 Examining Community Speaker Point Norms
Speaks are incredibly arbitrary, and there is a huge disparity in the points assigned by younger vs. older judges. My students use speaker point data to tie break between judges who may have the similar ideological views. Right now, they spend hours downloading data from Tabroom on how judges assign speaker points and manually enter it into a spreadsheet to calculate averages per person. 

I wanted to create a tool that would help them scrape this data automatically.

### 📊 Visualizing Voting History
At bigger tournaments, it's much harder to submit pref sheets due of the amount of judges in the pool. It's unsustainable to read > 50 paradigms to determine if a judge would be a good fit for you.

As a result, I wanted some tangible metrics for debaters to skim in order to quickly determine if a judge is worth having high on their pref sheet. I thought it would make sense for members of the community to contribute to these stats, similar to round reports on the wiki.


# 👩🏻‍💻 Future Improvements
My ultimate goal is allow people to log in, rate judges, track judge notes, and easily export ratings to CSV. Here is my [Figma](https://www.figma.com/design/NzjAgbv99iADlHR8EHuFBn/PrefBuddy?node-id=0-1) file as a proof of concept.

I have already started coding the necessary infrastructure to make this happen. However, I find it will be hard to serve users outside of College Prep on the free tiers of technology that I host my application on. For now, it will be hard to scale the app to allow more than a certain amount of queries to the database a day.

# 🤝 Contribute
Some of the data that I have to collect right now depends on community input. I'm specifically interested in collecting round reports from bid tournaments.

If you'd like to help identify round types (Policy vs. Policy, K vs. K, etc), please see [this page](https://pref-buddy.vercel.app/contributions).

### 🐞 Bug Fixes / Feedback
You can submit any issues or feedback using this [link :)](https://kellyye.notion.site/1ba08fc0dee1809cb1ddd4ace4a203c0).

### ☕️ Buy me a Coffee 
I am volunteering my time & paying for services like Vercel, Heroku, JawsDB to host this web application. To scale new features to more members of the community, I need to pay for higher tiers on deployment services. If you want to continue to support this project, please consider contributing by [buying me a coffee](https://buymeacoffee.com/kellyye).


# 🖥️ Tech Stack
- 🌐 Frontend:
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

- 🛠️ Backend:
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

- ☁️ DevOps & Deployment
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

- 🤖 Automation & Testing
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD) ![Playwright](https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)

- 💻 Programming Languages
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white) ![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white)

- 🌀 Version Control, Documentation & Project Management
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) ![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)

- 🎨 Design
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

# 🛠️ Release Notes
🍾 [1.0: Initial Release](/release-notes/release-1.0.md)

# 🔗 Relevant Links
- [Buy Me a Coffee](https://buymeacoffee.com/kellyye)
- [Round Report Contributions](https://kellyye.notion.site/1bb08fc0dee18002857ff253afa9b41b?pvs=105)
- [Report Bugs + Give Feedback](https://kellyye.notion.site/1ba08fc0dee1809cb1ddd4ace4a203c0?pvs=105)
