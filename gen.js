const { link } = require("fs");

const fs = require("fs").promises;

try {
(async function() {

    const nodeCount = +process.argv[2] || 500;

    const linkSaturation = +process.argv[3] || .2; // or linkCount

    // https://raw.githubusercontent.com/philipperemy/name-dataset

    function randInt(min, max) { // [min, max)
        return Math.floor(Math.random() * (max - min)) + min;
    }

    console.info("Reading names");
    const [ names, lastnames ] = await Promise.all([
        fs.readFile("./names.txt", "utf8").then(t => t.split("\n")),
        fs.readFile("./lastnames.txt", "utf8").then(t => t.split("\n")),
    ]);

    const nodes = [];
    let relations = [];

    console.info("Noding");
    for (let i = 0; i < nodeCount; i++) {
        if (i % 100 === 0) {
            console.info(`Node ${i}`)
        }
        const node = {
            id: i + 1,
        };

        node.name = `${names[randInt(0, names.length)].trim()} ${lastnames[randInt(0, lastnames.length)].trim()}`;
        nodes.push(node);

        node.relations = [];
        if (linkSaturation <= 1) {
            const relCount = Math.floor(nodeCount * linkSaturation);
            while (node.relations.length < relCount) {
                const rel = randInt(0, nodeCount) + 1;
                if (!node.relations.includes(rel)) {
                    node.relations.push(rel);
                }
            }
        }
    }

    // linkSaturation is just linkCount
    if (linkSaturation > 1) {
        const map = {};
        let count = 0;
        while (count < linkSaturation) {
            const link = `${randInt(0, nodeCount) + 1}:${randInt(0, nodeCount) + 1}`;
            if (!map[link]) {
                map[link] = 1;
                count++;
            }
        }
        relations = Object.keys(map).map(k => {
            const [ source, target ] = k.split(":");
            return {
                source,
                target,
            };
        });
    }

    // D3?
    const D3Object = {
        nodes: [],
        links: [],
    };

    console.info("Pushing nodes");
    D3Object.nodes = nodes;
    nodes.forEach(n => {
        for (const r of n.relations) {
            D3Object.links.push({
                source: n.id,
                target: r,
            });
        }
        delete n.relations;
    });
    if (relations.length > 0) {
        D3Object.links = relations;
    }
    await fs.writeFile(`nodes_d3_${nodeCount}_${linkSaturation}.json`, JSON.stringify(D3Object, undefined, 4), "utf8");

}());
} catch (e) {
    console.error(e);
}