<img src="../../client/public/Pref-Buddy-Icon.png" width="100" height="100">

# PrefBuddy 1.1
#### 🗓️ 4/1/25 | Judge Profiles Update

#### 🎉 What's New
- **Judge Badges**: Badges on a judge's profile for a top-level summary of their judging history.
  - <img src="./judge-badges/Value=Point Fairy, Size=Mini.png" height=16>: Judge's average speaker points >= community average speaker points +1 SD
  - <img src="./judge-badges/Value=Avg Speaks, Size=Mini.png" height=16>: Judge's average speaker points within (community average - 1 SD, community average + 1 SD)
  - <img src="./judge-badges/Value=Low Speaks, Size=Mini.png" height=16>: Judge's average speaker points <= community average - 1SD
  - <img src="./judge-badges/Value=Judges a Lot, Size=Mini.png" height=16>: If a judge has judged > 24 rounds this year
  - <img src="./judge-badges/Value=Mostly Judges Policy, Size=Mini.png" height=16>: If a judge has judged more policy rounds than K rounds*
  - <img src="./judge-badges/Value=Mostly Judges Ks, Size=Mini.png" height=16> If a judge has judged more K rounds than policy rounds*
  - <img src="./judge-badges/Value=Flex, Size=Mini.png" height=16> % of policy rounds and % of K rounds differ by < 30%
 
  \* A policy round is defined as a straight-up Policy v. Policy or T/Theory round. A K round is defined as any round where a K is read on the aff or the neg.


- **More Judge Stats**: Added speaker point SD, total rounds judged, and number of elims judged. There is also an indication of how many elims a judge has been sat in, and will be shown in red if they have been sat in >= 50% elims judged.

#### ⭐️ Improvements
- **Faster query times with Redis Caching**: queries to the database should now run faster.
