const { link } = require("fs");

const fs = require("fs").promises;

try {
(async function() {

    const nodeCount = +process.argv[2] || 500;

    const linkSaturation = +process.argv[3] || .2; // or linkCount

    const clusterCount = +process.argv[4] || 0;

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

        node.data = {};

        if (clusterCount > 0) {
            node.cluster = randInt(0, clusterCount) + 1;
            node.data.cluster = node.cluster;
        }
    }

    // linkSaturation is just linkCount
    if (linkSaturation > 1) {
        const map = {};
        let count = 0;
        while (count < linkSaturation) {
            const origin = randInt(0, nodeCount) + 1;
            const target = randInt(0, nodeCount) + 1;
            //if (nodes[origin - 1].cluster !== nodes[target - 1].cluster) continue;
            const link = `${origin}:${target}`;
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

    const GraphJSON = {
        nodes: [],
        edges: [],
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
    await fs.writeFile(`nodes_d3_${nodeCount}_${linkSaturation}_${clusterCount}.json`, JSON.stringify(D3Object, undefined, 4), "utf8");
    // .then(json => {
        //     json.nodes.forEach(n => {
        //         n.caption = n.name;
        //         delete n.name;
        //     });
        //     json.links.forEach(l => {
        //         l.caption = `${l.source}-${l.target}`;
        //     });
        //     json.edges = json.links;
        //     delete json.links;
        //     return json;
        // })

    // GraphJSON!
    // Care, overwrites!
    GraphJSON.nodes = D3Object.nodes.map(n => {
        n.caption = n.name;
        delete n.name;
        return n;
    });
    GraphJSON.edges = D3Object.links;
    GraphJSON.edges.forEach(e => {
        e.caption = `${e.source}-${e.target}`;
    });
    await fs.writeFile(`nodes_gj_${nodeCount}_${linkSaturation}_${clusterCount}.json`, JSON.stringify(GraphJSON, undefined, 4), "utf8");

}());
} catch (e) {
    console.error(e);
}