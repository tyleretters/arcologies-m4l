# ecologies

 - [Docs](#)
 - [Lines](#)

## Technical

Ecologies is a [Max for Live](https://cycling74.com/products/maxforlive/) device for [monome grid](https://monome.org/docs/grid/) built with lots of JavaScript. Max & [serialosc](https://github.com/monome/serialosc) do the heavy lifting with grid, midi, timings, and Ableton Live. The ecologies themselves are spun with threads of JSON by the dreaming JavaScript...

## Tests

The tests requrie [npm](https://www.npmjs.com/).

1. Run `npm test`.

## Docs

Developing the docs requires [Jekyll](https://jekyllrb.com/) & [SASS](https://sass-lang.com/). Hosted with [GitHub pages](https://pages.github.com/)

1. To run the docs locally at `127.0.0.1:4000`: `cd docs` and run `bundle exec jekyll serve`.
2. To work with the CSS: `cd assets/stylesheets` and run `sass --watch style.sass:style.css`.