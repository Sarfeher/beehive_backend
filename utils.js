

export function searchBee(beehive, beeId, reqBeeName) {
    let beeName;
    for (const bee of beehive) {
        if (bee.id == beeId) {
            beeName = bee.name;
            bee.name = reqBeeName;
        }
    }
    return beeName;
}

export function deleteBee(beehive, beeName) {
    let deletedItem;
    for (let i = 0; i < beehive.length; i++) {
        if (beehive[i].name === beeName) {
            deletedItem = beehive.splice(i, 1)[0];
            break;
        }
    }
    return deletedItem;
}

export function findOneBee(beehive ,beeId) {
    let searchedBee;
    for (const bee of beehive) {
        if (bee.id == beeId) {
            searchedBee = bee;
        }
    }
    return searchedBee;
}
