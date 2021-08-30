# Vonage-challenge
Vonage Challenge Project repository dedicated for the recruitment process.

# Contact Centre application

Let’s imagine you need to design a contact center application. It’s a simplified version of the domain on which we’re working on every day in Vonage.

There are 3 levels of employees: Agents, Supervisors, General Managers:

    - There can be multiple Agents.

    - There can be multiple Supervisors, but not more than Agents.

    - There can be only one General Manager.


There are 2 types of interactions: voice (phone), non-voice (text chat) with interaction routing protocols as follows:

    An Agent can handle 1 voice or 2 non-voice interactions at a time.

    A Supervisor can handle 1 voice or 2 non-voice interactions at a time.

    The General Manager can handle 1 interaction at a time.


The contact center allocates the incoming interactions in a specific way.

    An incoming interaction needs to be allocated to an Agent.

    If he cannot handle (reached maximum of interactions at a time) the interaction, it must be forwarded to Supervisor.

    In case the Supervisor cannot handle the interaction, it needs to be forwarded further, this time to the General Manager.

    If no-one can handle the interaction, the strategy is to reject that interaction.

## Questions

**How much time did you spend?**

**How can we build your solution and run unit tests?**

**What technologies / libraries / programming paradigms have you chosen? Why?**
Angular, Typescript with Jest for Testing. Angular has a good modularity built in while keeping very well separated contextes. State management is handled with RxJS and Redux (NgRx) with the Observables, changes are detected on push. 

Jest is for unit testing without having a real browser thanks to JSDom. To have it working with Angular some adjustment have been done to the configuration.

**Have you done any modeling / planning before coding? Please share that with us :)**