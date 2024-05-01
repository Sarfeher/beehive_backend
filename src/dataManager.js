
export default {deleteBeeByName};

function deleteBeeByName(beeName, beehive) {
    for (let bee of beehive) {
        if (bee.name == beeName) {
            deletedItem = beehive.splice(bee.id - 1, 1)[0]
            break;
        }
    }
}

