# OptiChain

Optimizing supply chains using ValueFlows.


# Description

This web app helps you take a "recipe" for some product, written in ValueFlows vocabulary, and turn it into a list of products you need to purchase and where to purchase them, optimizing for lowest cost within your acceptable range of travel.

This is an experiment, and so in the short term we just populate the application with a number of fake recipes and fake suppliers that we can use to prototype the idea. In the long term, this could be implemented as a network where producer nodes communicate with supplier nodes to find all local suppliers and optimize based on arbitrary criteria from there.

# Software Stack

This is a web app implemented with Bootstrap for styling, Vue.js for reactivity, and ValueFlows as our format for storing data.

# Running Locally

Simply host a web server in this folder at some port, and navigate to `localhost:port` in your browser.

For example, if you have Python 3 installed, in this folder run

`python3 http.server 8000`

and navigate to `localhost:8000` in your browser.

