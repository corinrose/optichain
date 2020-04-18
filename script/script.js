// this code will set a listener on the "submit" button
// on submit, it will read the data from the form in the DOM,
// run our algorithm to determine the lowest cost supply chain,
// hide the form on the webpage, and then replace it with a list
// of what to buy, where, and for how much

// class of locations
// center : string, a town name
// x : int, miles east of center
// y: int, miles north of center
class Location {
    constructor(center, x, y) {
        this.center = center;
        this.x = x;
        this.y = y;
    }

    // calculate distance between two locations in the name town
    dist(loc) {
        if (this.center != loc.center) {
            return false
        } else {
            // euclidean distance
            return Math.sqrt(Math.pow(loc.x - this.x, 2) + Math.pow(loc.y - this.y, 2))
        }
    }
}

// class of resources, or an inputs to a recipe
// name : string
// amt : nat num
// val : nat num, dollars
// recipe : Recipe, if the resource has a recipe, list it, if it's a raw material null
// loc : Location, optional so this can represent a generic resource or a concrete one
class Resource {
    constructor(name, amt, val, recipe = null, loc = null) {
        this.name = name;
        this.amt = amt;
        this.val = val;
        this.recipe = recipe;
        this.loc = loc;
    }
}

// class of sources where you can get a resources
// loc : Location
// res : list of resources for sale
// markup : [0, 1], the markup that the seller applies to the resources values
class Source {
    constructor(loc, res, markup) {
        this.loc = loc;
        this.res = res;
        this.markup = markup;
    }
    // returns the price of an amount of some resource
    price_resource(res) {
        // check if this source has a given resource, and if it does,
        // check if it has enough of it
        for (var i = 0; i < this.res.length; i++) {
            if (this.res[i].name == res.name && this.res[i].amt >= res.amt) {
                return res.amt * res.val * (1 + this.markup);
            }
        }
        // return 0 if resource is not available
        return 0;
    }

    list_resources() {
        var lst = [];
        for (var i = 0; i < this.res.length; i++) {
            lst.push(this.res[i].name);
        }
        return lst;
    }
}

// class of recipes for products
// res : list of Resources
// labor : nat num, hours of work to make product
// output : Resource, the output of the recipe
class Recipe {
    constructor(res, labor, output) {
        this.res = res;
        this.labor = labor;
        this.output = output;
    }

    produce_output(resources, labor) {
        if (labor < this.labor) {
            return false
        } else {
            // keep track of which resources are satisfied with list of booleans
            resources_satisfied = [];
            for (var i = 0; i < this.res.length; i++) {
                resources_satisfied[i] = false;
            }
            // check if every resource required by the recipe is
            // present in enough quantity in the inputted resource list
            for (var i = 0; i < this.res.length; i++) {
                for (var n = 0; n < resources.length; n++) {
                    if (this.res[i].name == resources[n].name && this.res[i].amt <= resources[n].amt) {
                       resources_satisfied[i] = true;
                    }
                }
            }
            // check if all resources have been satisfied
            // returns false if there are any missing resources,
            // indicated by a false being present in the satisfied list.
            // otherwise, returns the outputed resource
            if (resources_satisfied.includes(false)) {
               return false;
            } else {
                return this.output;
            }
        }
    }
}


// calculate the cost of a recipe, given a location and how far you can travel
// and a master list of all sources
function calc_cost(resource, loc, radius, sources) {
    var recipe = resource.recipe;
    var cost = 0;

    available_sources = [];

    // find sources that are within radius
    for (var i = 0; i < sources.length; i++) {
        console.log(loc.dist(sources[i].loc));
        if (loc.dist(sources[i].loc) == false) {
            continue;
        }
        if (loc.dist(sources[i].loc) < radius) {
            available_sources.push(sources[i])
        }
    }

    // base case
    if (recipe == null) {
        var satisfied = false;
        for (var n = 0; n < available_sources.length; n++) {
            if (available_sources[n].list_resources().includes(resource.name)) {
                satisfied = true;
                cost += available_sources[n].price_resource(resource);
            }
        }
        if (!satisfied) {
            return false;
        }
    // recursive case
    } else {
        // not a raw material, so we need to recursively cost resources
        for (var i = 0; i < recipe.res.length; i++) {
            item_cost = calc_cost(recipe.res[i], loc, radius, available_sources);
            if (!item_cost) {
                return false;
            }
            cost += item_cost;
        }
    }
    return cost;
}

// defining resources, recipes, locations, and sources for our demo application

// resources: hammer, stick, raw_wood, hammer_head, raw_metal

const hammer = new Resource("hammer", 1, 20);
const stick = new Resource("stick", 1, 1);
const raw_wood = new Resource("raw_wood", 1, 0.25);
const hammer_head = new Resource("hammer_head", 1, 10);
const raw_metal = new Resource("raw_metal", 1, 5);


// recipes: hammer, stick, hammer head
//
// we see each recipe has a tree structure,
// with the root being the outputs,
// leaf nodes being the raw materials,
// and internal nodes being intermediate resources

hammer.recipe = new Recipe([stick, hammer_head], 5, hammer);
stick.recipe = new Recipe([raw_wood], 0.25, stick);
hammer_head.recipe = new Recipe([raw_metal], 2, hammer_head);

// locations: poughkeepsie, williamstown

const pok = new Location("Poughkeepsie", 0, 0);
const wil = new Location("Williamstown", 0, 0);

// sources: lumber yards, scrap metal yards
// randomized locations

const pok_metal = new Source(new Location("Poughkeepsie", 3, -5), [new Resource("raw_metal", 10, 5)], 0.15);
const pok_wood = new Source(new Location("Poughkeepsie", -4, 0), [new Resource("raw_wood", 25, 1)], 0.2);

const wil_metal = new Source(new Location("Williamstown", 2, -1), [new Resource("raw_metal", 6, 5)], 0.12);
const wil_wood = new Source(new Location("Williamstown", 0, -2), [new Resource("raw_wood", 22, 1)], 0.21);

// master list of sources (in the future can be done on town by town basis)
sources = [pok_metal, pok_wood, wil_metal, wil_wood];

// application implementation

submit_button = document.getElementById("submit_button");
submit_button.addEventListener("click", run)

function run() {
    var output = document.getElementById("output");

    // read submitted data
    var item = document.getElementById("itemSelect");
    item = item.options[item.selectedIndex].value;

    var loc = document.getElementById("locationSelect")
    loc = loc.options[loc.selectedIndex].value;

    var radius = document.getElementById("radius").value;

    // parse submitted data into our language
    switch(item) {
        case "Hammer":
            resource = hammer;
            break;
        case "Stick":
            resource = stick;
            break;
        case "Hammer Head":
            resource = hammer_head;
            break;
    }
    switch(loc) {
        case "Poughkeepsie":
            loc = pok;
            break;
        case "Williamstown":
            loc = wil;
            break;
    }

    cost = calc_cost(resource, loc, parseFloat(radius), sources);

    if (!cost) {
        output.innerHTML = `You cannot build this item with resources found in your region of travel. Try again with a larger radius.`
        return;
    }

    cost = Math.round((cost + Number.EPSILON) * 100) / 100

    prereqs = [];
    for (var i = 0; i < resource.recipe.res.length; i++) {
        prereqs.push(resource.recipe.res[i].name);
    }

    output.innerHTML = `You are building a ${resource.name} in ${loc.center}.

                        In order to do so, you must first need the following: ${prereqs}.
                        <hr>
                        Total cost: ${cost}$`;

}
