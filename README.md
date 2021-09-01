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
To run the application in browser make sure you have node installed (LTS, 16 used during development), clone this repo, run `npm install`

### Build

Run `ng build vonage-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test vonage-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

Run `nx run-many --all --target=test --codeCoverage` to execute all unit tests and generate code coverage

More Nx specific information in the Nx-README.md file.

**What technologies / libraries / programming paradigms have you chosen? Why?**
Angular, Typescript with Jest for Testing. Angular has a good modularity built in while keeping very well separated contextes. State management is handled with RxJS and Redux (NgRx) with the Observables, changes are detected on push.

Jest used for unit testing.

**Have you done any modeling / planning before coding? Please share that with us :)**
I've started setting up the project with the technology stack I wanted to use. In the mean time I started to work to a UML like diagram with the classes that are described in the User Story. After setting up the project and starting to define some interfaces I saw the limitation of the setup, so I switched to another manager of workspaces which is a little more complicated but also more complete and rich of CLI commands to scaffold components (called Nx)[https://nx.dev].
