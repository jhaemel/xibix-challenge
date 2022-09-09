class CalculateViewSpotsService {

    constructor() {
        this.fs = require('fs');
    }

    calculate(filefileNameWithAbsolutePathPath, numberOfViewSpots) {
        const startTime = performance.now();
        console.log('Starting calculations...');

        const rawData = this.fs.readFileSync(filefileNameWithAbsolutePathPath);
        const meshData = JSON.parse(rawData);

        // Indexed heights by lement ids, so we can access the heights faster
        const heightsIndexedByElementId = {};
        for (let heightElementData of meshData['values']) {
            heightsIndexedByElementId[heightElementData['element_id']] = heightElementData['value'];
        }
        // results will contain the viewspots and their height
        let results = [];
        // excludedParentIds contains elementIds, which can be excluded, as those ids are neigbours of viewspots
        let excludedParentIds = [];

        parentLoop: for (let parentElement of meshData['elements']) {
            const parentElementId = parentElement['id'];

            if (excludedParentIds.includes(parentElementId)) {
                continue;
            }

            const parentHeight = heightsIndexedByElementId[parentElementId];
            for (const childElement of meshData['elements']) {
                const childElementId = childElement['id'];
                if (parentElementId === childElementId) {
                    continue;
                }
                // Check if current parentElement and childElement are matching atleast one nodeId 
                const hasAtLeastOneEqualNode = parentElement['nodes'].some(parentNodeIds => childElement['nodes'].includes(parentNodeIds));
                if (!hasAtLeastOneEqualNode) {
                    continue;
                }
                // Skip parentElement if childElement is higher
                if (parentHeight < heightsIndexedByElementId[childElementId]) {
                    continue parentLoop;
                }
                excludedParentIds.push(childElementId);
            }
            results.push(
                {
                    parent: parentElementId,
                    values: parentHeight
                }
            );
        }

        // Sort the results by height to slice it afterwards (get heighest to {numberOfViewSpots} viewspots)
        results.sort((firstValue, secondValue) => { return secondValue.values - firstValue.values });
        results = results.slice(0, numberOfViewSpots);

        console.log(`Calculations done.`);

        const calcualtionTime = Math.floor(performance.now() - startTime);
        console.log(`Execution took ${calcualtionTime} milliseconds.`);
        return results;
    }
}

module.exports = CalculateViewSpotsService;