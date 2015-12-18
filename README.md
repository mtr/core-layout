[![bitHound Overall Score](https://www.bithound.io/github/mtr/core-layout/badges/score.svg)](https://www.bithound.io/github/mtr/core-layout)
[![bitHound Dependencies](https://www.bithound.io/github/mtr/core-layout/badges/dependencies.svg)](https://www.bithound.io/github/mtr/core-layout/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/mtr/core-layout/badges/devDependencies.svg)](https://www.bithound.io/github/mtr/core-layout/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/mtr/core-layout/badges/code.svg)](https://www.bithound.io/github/mtr/core-layout)

# core-layout
A responsive AngularJS layout component for a simple, yet not completely trivial, Web-app layout that works well on both small (mobile) and larger screens.  An important feature is its use of iScroll 5.x, through [angular-iscroll](https://github.com/mtr/angular-iscroll), to support fixed-position headers and footers without using the CSS `position: fixed` formatting instruction which is not well supported on older Android (<= 4.1.2 ?) and iOS (<= 8.x) versions.  

## Install

Install the [core-layout NPM package](https://www.npmjs.com/package/core-layout)
```bash
npm install --save core-layout
```

Or, to check out a development version, start by cloning the repository, by
```bash
git clone git@github.com:mtr/core-layout.git
```
Then, install the necessary dependencies:
```bash
cd core-layout/
npm install
```
After that, you should have a `dist` directory with a subdirectory named `lib`:
```
dist/
└── lib
    ├── core-layout.js
    └── core-layout.min.js
```

### Build

To rebuild the library, run
```bash
gulp            # or "gulp watch" (to rebuild on every file change)
```

To build the examples, run
```bash
gulp examples   # (will rebuild on every file change)
```


## Demo
You may have a look at an Angular [demo app](https://mtr.github.io/core-layout/examples/) that shows how you can use this `core-layout` module.
