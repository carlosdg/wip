# Contributing guidelines

First of all we want to give you a BIG thank you for being willing to help this project 😊

1.  Fork the repository 🍴
2.  Clone it to your local environment 💻
3.  Install the dependencies with `npm install`.

    Note for curious people: this is a monorepo and we are using lerna to manage it. After the install a postinstall script will be executed which just runs `lerna bootstrap` which in turn runs `npm install` for each package and creates the symbolic links for dependencies between packages.

4.  Go to the package that you wish to make changes to (they are in the `packages` folder).
5.  If you are going to change something in `wiplib` first run the tests:

    -   Run `npm test`

        This way you know in what state the project is before doing any changes. Imagine that you didn't run the tests and after changing something you run the tests and they fail 😨.

        By running the test before anything you don't need to waste your afternoon in something that may not have been your fault, it could been an error that was already there or something happened forking, clonning or installing the dependencies.

6.  Create a branch for your pull request
7.  Add your changes
8.  Run the tests
9.  Commit and push to your forked project
10. Submit your pull request 😇

Note that if you are working on both packages: `wipapp` and `wiplib` you have to run `npm run build` on `wiplib` so `wipapp` uses the latest version of the library (or you can just run `npm run build:watch` to have a watcher that everytime you change a file in `wiplib` it builds the library)
