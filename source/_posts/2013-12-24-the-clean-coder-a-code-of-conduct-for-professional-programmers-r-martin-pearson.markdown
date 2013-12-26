---
layout: post
title: "The Clean Coder - A Code of Conduct for Professional Programmers - R. Martin (Pearson)"
date: 2013-12-24 22:14
comments: true
categories: ["Book Reviews"]
---
I have recently finished the book ["The Clean Coder - A Code of Conduct for Professional Programmers - R. Martin (Pearson, 2011) BBS"](http://www.amazon.com/gp/product/0137081073/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0137081073&linkCode=as2&tag=panayotmatsin-20). Here is my short review:

Overall: Fantastic. Worth reading for every developer that wants to become professional.

## My Notes and Highlights ##

<!-- more -->

### Chapter 1 - Professionalism ###

- Professionalism is a marker of responsibility and accountability.
- It is better to make your manager unhappy rather than your managers customers.
- You must be responsible for your imperfections.
- QA should find nothing. Very well put. How development team should be stand next to QA team. Very good points.
- How can you know your code works? Test it.
- How much of the code should be tested? All of it!
- But isn't some code hard to test? Yes, but only because that code has been designed to be hard to test.
- TDD will give you code that is easy to test.
- Do no harm to structure. Delivering function at the expense of structure is a fool's errand.
- Merciless Refactoring. "The Boy Scout Rule": Always check in a module cleaner than when you checked it out.
- Software should be easy to change and developers should not be afraid to change code. They shouldn't be afraid because they should be having tests for the code that is to be changed.
- Your career is your responsibility. It is not your employer's responsibility to make sure you are marketable.
- Know your field. A wealth of ideas, disciplines, techniques, tools and terminologies decorate the last fifty years of our field. If you want to be a professional you have to know a sizable chunk of it and constantly be increasing the size of that chunk. I would question here, what is the limit though? You cannot know everything. No doctor knows everything. They have a specialization. Here is the suggested list:
    * Design patterns
    * Design principles
    * Disciplines
    * Artifacts
- Continuous learning in order to keep up.
- Professionals should be practicing. It is not enough to simply do your daily job and call that practice.
- Collaborate with other people.
- Teach other people.
- Understand the domain. When you are developing an application try to learn the domain as much as possible.
- Your employer's problems are your problems. Put yourself in your employer's shoes. Address their needs, not yours.
- Humility. Professionals do not demean another for making a mistake, because they know they may be the next to fail.

### Chapter 2 - Saying No ###

- Aren't you supposed to do what your boss says? No. Not if you are a professional. Professionals are expected to say no.
- Managers accept "I'll try" as "Yes".
- When two professionals, manager and developer, work to reach the best possible outcome, conversation might be a bit adversarial and there might be some few uncomfortable moments, but that's expected.
- Why something will take that long is much less important than the fact. Providing too much detail might be an invitation for micro-management. This might lead to questions on details that manager might consider unnecessary, but still developer considers that part of the quality assurance process.
- The most important time to say no is when the stakes are highest.
- Being a Team Player. A Team Player is not somebody who says "yes" all the time.
- "OK, I'll try" is the worst response one developer can give to a manager. This is a very good analysis of how bad is to say "I'll try".
- Professionals become heroes when they get the job done well, on time and on budget.

### Chapter 3 - Saying Yes ###

- There are three parts to making a commitment:
    1. You say you'll do it.
    2. You mean it.
    3. You actually do it.
- There are some words that people use which reveal that what these people say are not going to do.
    * Need/should
    * Hope/wish
    * Let's
- The secret ingredient to recognizing real commitment is to look for sentences that sound like this: I will...by...
- You can only commit to things that you have full control of.
- If it cannot be done, you can still commit to actions that will bring you closer to the target.
- If you cannot make a commitment, you better raise a red flag the as soon as possible.

### Chapter 4 - Coding ###

- It is up to you to see problems in the requirements and discuss that with the customer in order to make sure that the solution you are providing covers the true needs of the customer.
- Your code must be readable by other programmers.
- Don't write code when you are tired.
- When you are are worried about personal stuff, don't code, or try to find a way to shut down the background process, or at least its priority so that it's not a continuous distraction. Try to spend a dedicated amount of time on the issue that creates the worry.
- Avoid the `Zone` (when you are highly focused, tunnel-vision state of consciousness). This state of `Zone` is not really hyper-productive neither infallible.
- One of the big benefits of pair programming is that it is impossible for a pair to enter the `Zone`.
- The rude response to an interruption often comes from the `Zone`.
- Pairing can be helpful to deal with interruptions.
- The professional attitude to an interruption is a polite willingness to be helpful.
- If you cannot code and you are blocked, find a pair partner.
- If you cannot create output, process creative input. And you will be unblocked.
- TDD will reduce the time you spend on debugging.
- When you are stuck, when you are tired, disengage for a while.
- The trick to manage lateness is early detection and transparency.
- Do not hope that you can get it all done. Hope is the project killer.
- Working overtime needs to have a fall-back plan created by your boss in case the overtime effort fails.
- Acceptance Tests must pass before one can say that something is done.
- You have to ask for help and you have to offer it when you are asked for.

### Chapter 5 - Test Driven Development ###

TDD:

- You are not allowed to write any production code until you have first written a failing unit test.
- You are not allowed to  write more of a unit test than is sufficient to fail.
- You are not allowed to write more production code that is sufficient to pass the currently failing unit test.

Benefits:

- Certainty.
- Low defect injection rate.
- Courage to change code that works, in order to refactor it and clean it up.
- Documentation. The unit tests are documents.
- Makes you think about better, decoupled design.

### Chapter 6 - Practicing ###

- A programming kata is a precise set of choreographed keystrokes and mouse movements that simulates the solving of some programming problem.
- A programmer should know several different kata and practice them regularly so that they don't fade away from memory.
- Have programming session for practicing with pairs.
- Contribute to an open-source project.
- Since your practice time is your own time, you don't have to use the same languages or platforms that you use with your employer. Pick any language you like and keep your polyglot skills sharp.

### Chapter 7 - Acceptance Testing ###

- Both business and programmers are tempted to fall into the trap of premature precision.
- The more precise you make your requirements, the less relevant they become as the system is implemented.
- Estimating the system does not require precision. The requirements will change making precision moot.
- Sometimes, stakeholders simply assume that their readers know what they mean.
- Acceptance Tests are written in order to define when a requirement is done.
- One of the most common ambiguities is the "done".
- When the acceptance tests for your feature pass, you are done.
- Acceptance tests should always be automated.
- Professional developer negotiates with the test author for a better test.
- Testing through the GUI is always problematic unless you are testing just the GUI.
- Every time someone commits a module, the CI system should kick off a build, and then run all the tests in the system.
- CI tests should never fail. If they do, stop the presses. The developers need to make them green again.

### Chapter 8 - Testing Strategies ###

- Development should have as goal that QA finds nothing
- Business writes the happy path tests, whereas QA writes the corner, boundary and unhappy-path tests.
- QA identifies the actual behaviour of the system using the discipline of exploratory testing.
- Unit Tests. Are written by developers.
- Component Tests. Are written by QA and Business with assistance from development.
- Integration Tests. Have meaning for larger systems that have many components. They do not test business rules. Rather they test how well the assembly of components dances together. Typically written by system architects or lead designers of the system. We can see here performance and throughput tests. They are not typically executed as part of the CI suite. But as often as it is deemed necessary.
- System Tests. Execute against the entire integrated system. Written by system architects and technical leads. They need to ensure correct system construction and not correct system behaviour.
- Manual Exploratory Tests. Explore the system for unexpected behaviours while confirming expected ones.

### Chapter 9 - Time Management ###

- There are two truths about meetings:
    * Meetings are necessary.
    * Meetings are huge time wasters.
- Often these two truths often describe the same meeting.
- You do not have to attend every meeting to which you are invited.
- One of the most important duties of your manager it to keep you out of meetings.
- When the meeting gets boring, leave.
- Have an agenda and a goal.
- Stand-Up Meetings
    1. What did I do yesterday?
    2. What am I going to do today?
    3. What's in my way?
- Iteration Planning Meetings. Rule of thumb: Should not take no more than 5% of the total time in the iteration.
- For a two-week iteration, retrospectives should not last more than 25 minutes.
- Any argument that can't be settled in five minutes can't be settled by arguing.
- Without data, any argument that doesn't forge agreement within a few minutes (somewhere between five and thirty) simply won't ever forge agreement. The only thing to do is to go get some data.
- If you finally agree, then you must engage. Do not be passive-aggressive.
- Beware of meetings that are really just a venue to vent a disagreement and to gather support for one side or the other.
- Vote or flip a coin. It's better than arguing forever.
- 7 - 8 hours good sleep is very important so that you can give 8 good hours with full focus on your work.
- Caffeine puts a strange "jitter" on your focus. Too much of it can send your focus off in very strange directions.
- Recharge. Good long walk,conversation with friends and such.
- Somehow muscle focus help to recharge mental focus.
- Use the well-known Pomodoro Technique to manage your time at work.
- Priority Inversion is a lie that we tell ourselves. Professionals executes in priority order even if they don't like it.
- When you are in one hole, then stop digging.
- Realize when you are in a blind alley and find the courage to back out.
- Messes are worse than blind alleys. They slow you down, but don't stop you. Going forward always looks shorter than the way back, but it isn't.
- When there is a mess, going back will never be easier than it is now.

### Chapter 10 - Estimation ###

- Business likes to view estimates as commitments. Developers like to view estimates as guesses. The difference is profound.
- A commitment is something you must achieve no matter what.
- Professionals don't make commitments unless they know they can achieve them.
- An estimate is a guess. No commitment is implied.
- Most software developers are terrible estimators.
- An estimate is a distribution.
- PERT. Good explanation.
- The most important estimation resource you have are the people around you.
- Law of Large Numbers. If you break up a large task into many smaller tasks and estimate them independently, the sum of the estimates of the small tasks will be more accurate than a single estimate of the larger task.

### Chapter 11 - Pressure ###

- The professional developer is calm and decisive under pressure.
- The best way to stay calm under pressure is to avoid the situations that cause pressure.
- The way to go fast and to keep the deadlines at bay, is to stay clean.
- Dirty always means slow!
- You know what you believe by observing yourself in a crisis. If in a crisis you follow your disciplines then you really believe in them.
- Manage your stress.
- Do not rush while in crisis. Rushing will only drive you deeper into the hole.
- Let your team and superiors that you are in trouble.
- When there is a crisis, try to pair.

### Chapter 12 - Collaboration ###

- Collaborate with your managers, business analysts, testers, and other team members to deeply understand the business goals.
- Owned Code. Avoid at all means. It is a recipe for disaster.
- Have the team own all the code.
- Pairing is the most efficient way to solve a problem.
- No system should consist of code that hasn't been reviewed by other programmers.
- The most efficient and effective way to review code is to collaborate in writing it.
- Programmers work together.

### Chapter 13 - Teams and Projects ###

- There is not such thing as half a person.
- It makes no sense to tell a programmer to devote half their time to project A and the rest of their time to project B.
- The team should be composed of programmers, testers, and analysts. And it should have a project manager.
- A nicely gelled team of twelve might have seven programmers, two testers, two analysts, and a project manager.
- Professional development organizations allocate projects to existing gelled teams, they don't form teams around projects.

### Chapter 14 - Mentoring, Apprenticeship, And Craftsmanship ###

- What you learn in school and what you find on the job are often very different things.
- Companies who hire CS graduates ought to invest more in their training than McDonalds invests in their servers.
- School cannot teach the discipline, practice, and skill of being a craftsman.

---
If you liked what you've read above, you will find many more details and nice arguments in this excellent book: ["The Clean Coder - A Code of Conduct for Professional Programmers - R. Martin (Pearson, 2011) BBS"](http://www.amazon.com/gp/product/0137081073/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0137081073&linkCode=as2&tag=panayotmatsin-20)