### Graphs' list
https://www.experfy.com/blog/the-list-of-graph-visualization-libraries/

From the ones on the list:
* Ogma: Great performance, okay docs
* Alchemy: Good docs, out-of-the-box clustering
* VivaGraphJS: Simple and powerful
* GraphGL: **really** powerful, low-level WebGL
* ggraph: Easy

1. Graphs using WebGL are better performing than canvas-based ones.
2. Edges seem to affect performance more than nodes, which does make sense.

From those libraries:
* ggraph is not performant with a couple dozens of nodes
* GraphGL is really complex, including shaders and such which is overkill and not time-sensitive
* VivaGraphJS is maybe _too_ simple
* Alchemy is really buggy
* *Ogma* seems really good, which will be our choice