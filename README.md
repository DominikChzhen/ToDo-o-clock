# ToDo o'clock

It´s ToDo o'clock
Stop procrastinating, start working. Optimize your productivity now.

Introduction
In today's fast-paced world, where individuals are constantly managing multiple responsibilities, the ability to stay organized and focused is more important than ever. But there is a problem: Most of us procrastinate. Studies estimate that 95% of college students engage in some form of procrastination (Ellis & Knaus, 1979). We delay doing unpleasant ToDo's that we wish we would do sooner. And procrastination can be very costly. It is associated with increased academic stress (Meier et al., 2016), lower well-being (Meier et al., 2016), and low sleep quality (Song et al., 2020) to name some examples.

But don't worry - it's ToDo o'clock. Our tool is designed for people who want to get on with their ToDo's. In doing so, we are responding to the increasing demands of the modern work environment, which has highlighted the importance of effective time management and focus strategies.

To do so, a key feature of ToDo o'clock is the integration of the Eisenhower Matrix, a time management tool that helps users prioritize ToDo's effectively. The Eisenhower Matrix is divided into four categories:
•	Urgent and Important - Do immediately: 
This is for ToDo's that require urgent and focused attention. They are critical and time-sensitive and have a significant impact on long-term goals. Typical ToDo's include meeting deadlines or dealing with important assignments. These are the ToDo's that are most likely to cause stress because of their importance.
•	Not urgent but important - Plan for later: 
These ToDo's are essential for long-term success, but they don't need to be done immediately. However, it's a good idea to make time in your schedule for them. Such ToDo's may include activities such as strategic planning or personal skills development.
•	Urgent but not Important - Delegate: 
This section consists of ToDo's that require immediate attention but are not critical to your primary goals. Often these ToDo's can be delegated to others as they do not require specialized skills, reducing your workload and providing growth opportunities for team members (when working in a team). Typical examples are routine reporting or managing non-essential emails. 
•	Not Urgent and not Important - Delete from ToDo list: 
ToDo's here are neither urgent nor important, and typically serve as distractions and take up too much time. It's a good idea to remove them from your ToDo list so you can focus on more important goals. 

By automatically categorizing ToDo's into these four categories, ToDo o'clock prioritizes users's ToDo's effectively, reducing the overwhelming feeling of having too many open ToDo's and not knowing how to start.

But it does not stop there. We implemented the Pomodoro Timer technique which enhances focus and productivity through structured work intervals. Users commit to focused work sessions of typically 25 minutes, followed by a short break. After completing four work sessions, a longer break follows, which completes a Pomodoro cycle. This can of course be adapted to individual needs. 

Method 
1. Conceptual brainstorming

The first step was an intensive brainstorming session. We discussed the needs of our users and developed the key features for our tool:
•	ToDo List: This feature allows users to add, edit, delete and mark ToDo's as completed. We decided to use pop-up windows for adding new and editing existing ToDo's, which open by clicking on the according buttons. 
•	Pomodoro Timer: A customizable timer that opens on demand to help users work in focused intervals and take time-limited breaks. 
•	Navigation bar: Designed to be collapsed on smaller screens to improve usability.
•	Gamification using productivity statistics: These statistics display the number of open and completed ToDo’s and how long the Pomodoro timer has been running, giving insight into the users productivity.
•	Sign-in/Login functionality: This not only ensures that users' ToDo's and statistics are saved for long-term access, but also creates a level of personalization that makes working feel smoother.

2. The design:

Using Figma, we created a user-friendly design. Our focus was on maintaining an intuitive interface that is low on distractions but still aesthetically pleasing, encouraging user interaction with minimal effort, and keeping the user focused.

3. Front-end development:

We used HTML to create the basic framework of our web pages, ensuring that each function is logically organized and accessible. With the help of CSS, we were able to implement our design consistently across all features. Interactive elements such as opening and closing dialogues, working with the Pomodoro timer and the collapsible navigation bar were implemented using JavaScript.

The components were integrated by connecting all front-end files, ensuring seamless interaction between different features and providing a smooth user experience.

4. Back-end development:

Our back-end team was then tasked with connecting the front-end functionality to a database, ensuring data persistence, and implementing logic for user authentication and task management. This involved setting up a server to handle user requests and creating a database to store user information and ToDo’s.

Results and Learnings
The outcome of our project is a fully functional productivity tool called “ToDo o'clock" that successfully integrates the features we envisioned to enhance user productivity and task management.

We are proud of what we have achieved. ToDo o'clock fulfils the goals of creating a smoothly functioning productivity tool that increases user productivity through comprehensive task management solutions. Most importantly, its development has given us the opportunity to improve our web development skills. 

Opportunities for further development

However, we have a few features in mind that could greatly enhance ToDo o'clock which we could not implement due to the short project time. 
•	We see great potential in introducing a feature that recommends productive activities during breaks, considering factors such as break duration, time of day and weather. This could help users optimize their entire working day using ToDo o'clock, rather than just managing their working periods.
•	In addition, implementing a calendar feature would be a valuable addition, allowing users to organize their to-do's on a daily or weekly basis for better planning.
•	Enhancing the gamification elements is also a very powerful way to improve user motivation. By allowing users to earn rewards for completed tasks and participate in leaderboards, we could create an engaging competitive environment that drives productivity and user interaction.

https://www.figma.com/deck/WgmRUsOjkzumZITxRQOOJK/CalenDo-Pr%C3%A4sentation?node-id=1-25&t=7pV8liqvPy1eIC8i-1

Literature

Ellis, A., & Knaus, W. J. (1979). Overcoming procrastination: Or how to think and act rationally in spite of life’s inevitable hassles (1. Signet print). New American Libr.
Meier, A., Reinecke, L., & Meltzer, C. E. (2016). “Facebocrastination”? Predictors of using Facebook for procrastination and its effects on students’ well-being. Computers in Human Behavior, 64, 65–76. https://doi.org/10.1016/j.chb.2016.06.011
Song, B., Jing, Q., & Wang, B. (2020). Procrastinate at Work, Sleep Badly at Night: How Job Autonomy Matters. Academy of Management Proceedings, 2020(1), 18346. https://doi.org/10.5465/AMBPP.2020.18346abstract

Team & Position

Dominik Chzhen 	frontend - development
Felix Krenzel 		frontend - development
Julia Khalil		frontend - development

Christopher Resing 	backend - development
Konstantin Knorre 	backend - development

https://ms.techlabs.org/projects/it-s-todo-o-clock
