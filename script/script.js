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
            return Math.sqrt(pow(loc.x - this.x, 2) + pow(loc.y - this.y, 2))
        }
    }
}

// class of resources, or an inputs to a recipe
// name : string
// amt : nat num
// loc : Location
// val : nat num
class Resource {
    constructor(name, amt, loc, val) {
        this.name = name;
        this.amt = amt;
        this.loc = loc;
        this.val = val;
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
    price_resource(res, amt) {
        // check if this source has a given resource, and if it does,
        // check if it has enough of it
        for (var i = 0, i < this.res.length, i++) {
            if (this.res[i].name == res.name && this.res[i].amt >= res.amt) {
                return res.amt * res.val * this.markup;
            }
        }
        // return 0 if resource is not available
        return 0;
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
            resources_satisfied = [for (x of this.resources) false];
            // check if every resource required by the recipe is
            // present in enough quantity in the inputted resource list
            for (var i = 0; i < this.res.length; i++) {
                for (var n = 0; n < resources.length, n++) {
                    if (this.res[i].name == resources[n].name && this.res[i].amt <= resources[n].amt) {
                       resources_satisfied[i] = true;
                    }
                }
            }
            // check if all resources have been satisfied
            // returns false if there are any missing resources,
            // indicated by a false being present in the satisfied list.
            // otherwise, returns the outputed resource
            if resources_satisfied.includes(false) {
               return false;
            } else {
                return this.output;
            }
        }
    }
}


function submit() {
    
}
