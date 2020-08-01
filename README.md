![Node.js CI](https://github.com/tyleretters/arcologies/workflows/Node.js%20CI/badge.svg?branch=master)

**This implementation of arcologies has been abandonned. Development has been moved to norns.**

# arcologies m4l

If you are an artist, musician, or arcologist here to use this instrument, [everything you need to know is in the docs](https://tyleretters.github.io/arcologies-m4l).

This README is for developers looking to contribute to building **arcologies**.

## Technical

**arcologies** is a [Max for Live](https://cycling74.com/products/maxforlive/) device for [monome grid](https://monome.org/docs/grid/) built with lots of JavaScript. Max & [serialosc](https://github.com/monome/serialosc) do the heavy lifting with grid, midi, timings, and Ableton Live. The arcologies themselves are spun with threads of JSON by the dreaming JavaScript...

## Tests

1. `npm install`
2. `npm test`
3. `npm run watch`

The tests requrie [npm](https://www.npmjs.com/). Tests are all in `./tests.js`. Running `npm test` concatenates `src.js` with `tests.js` and executes `runTestSuite()`.

## Docs

Developing the docs themselves requires [Jekyll](https://jekyllrb.com/) & [SASS](https://sass-lang.com/). Hosted with [GitHub pages](https://pages.github.com/)

1. To run the docs locally at `127.0.0.1:4000`: `cd docs` and run `bundle exec jekyll serve --baseurl ''`.
2. To work with the CSS: `cd assets/stylesheets` and run `sass --watch style.sass:style.css`.
