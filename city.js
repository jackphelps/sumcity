// the city is a grid. 
// the people wake up, go to work, socialize, and go home. 
// sometimes, something interesting happens.

// some stuff is sadly missing: 
    // realistic relationship between real estate types and number of people
    // mixed-use / multi-business blocks
    // ages, kids/schools, retired people
    // government beyond police
    // social groups incl. romantic relationships
    // hotels & travelers
    // areas that vary by density / zoning -- give the city a realistic center and gradient
    // vagrancy

function init() {

  citySettings = {
    numpeople: 300,
    squares: 400,
    percentBuildings: 0.7
  }

  // make modules & db when stuff is locked down
  var settings    = {},
      seed        = {},
      city        = {},
      i, j;

  city.people = [];
  city.places = [];
  city.jobs   = [];

  seed.mNames           = ['Nick', 'Ian', 'Joe', 'Zack', 'Dave', 'Adam', 'Jesse', 'Roman', 'Stebs', 'Justin', 'Garrett', 'Benji', 'Blake', 'Najee', 'Jamie', 'Noah', 'Paul', 'Spencer', 'Sam'];
  seed.fNames           = ['Helena', 'Polina', 'Janice', 'Nina', 'Sarah', 'Emily', 'Deana', 'Stephanie', 'Jackie', 'Anneken', 'Amanda', 'Marie', 'Isabel', 'Anna', 'Maija', 'Jessie', 'Inna'];
  seed.lastNames        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  seed.placeCategories  = [
                            {category:'residential',  frequency: 3},
                            {category:'commercial',   frequency: 2},
                            {category:'hangout',      frequency: 2},
                            {category:'park',         frequency: 1},
                            {category:'store',        frequency: 1}
                          ],
  seed.homeActivities   = ['reading a book', 'watching TV', 'talking on the phone', 'napping', 'staring listlessly at the internet'];
  seed.companyNames     = ['Global', 'Serv', 'Soft', 'Tek', 'Omni', 'Products', 'Blue', 'American', 'International', 'Micro', 'Capital', 'Consumer', 'Manufacturing'];
  seed.storeNames       = ['FoodWay', 'S Mart', 'Circle K', 'Baby Warehouse', 'Kitchens and You', 'City Bunny Lingerie', 'WholeHealth', 'Jockular Sports', 'ServTek', 'The Mall'];
  seed.hangoutNames     = ['Capitol Restaurant', 'Fiore\'s Italian', 'Wok N Roll', 'Chung\'s Chinese Palace', 'Central Diner', 'Cuppa Joe\'s', 'the Watering Hole', 'VIP Cocktail Lounge', 'the extremely hip "speakeasy" with no sign', 'The Comedy Basement', 'the library'];
  seed.jobs             = [
                            {   
                              name:       'sotware engineer',
                              routine:    [{'10:00': 'work', '7:30': 'off'}],
                              incidence:  2,
                              prosperity: 3
                            },
                            {   
                              name:       'visual artist',
                              routine:    [{'10:30': 'work', '7:30': 'off'}],
                              incidence:  3,
                              prosperity: 2
                            },
                            {   
                              name:       'banker',
                              routine:    [{'9:30': 'work', '8:30': 'off'}],
                              incidence:  3,
                              prosperity: 4
                            },
                            {   
                              name:       'creative director',
                              routine:    [{'9:30': 'work', '6:30': 'off'}],
                              incidence:  3,
                              prosperity: 3
                            },
                            {   
                              name:       'retail sales associate',
                              routine:    [{'9:30': 'work', '6:30': 'off'}],
                              incidence:  5,
                              prosperity: 1
                            },
                            {   
                              name:       'C-level exective',
                              routine:    [{'9:30': 'work', '6:30': 'off'}],
                              incidence:  1,
                              prosperity: 5
                            },
                            {   
                              name:       'account manager',
                              routine:    [{'9:00': 'work', '5:30': 'off'}],
                              incidence:  4,
                              prosperity: 2
                            },
                            {   
                              name:       'delivery person',
                              routine:    [{'random': '8'}],
                              incidence:  3,
                              prosperity: 1
                            },
                            {   
                              name:       'police officer',
                              routine:    [{'random': '8'}],
                              incidence:  2,
                              prosperity: 2
                            },
                            {   
                              name:       'cab driver',
                              routine:    [{'random': '12'}],
                              incidence:  4,
                              prosperity: 1
                            },
                            {   
                              name:       'bartender and server',
                              routine:    [{'random': '8'}],
                              incidence:  3,
                              prosperity: 2
                            }
                          ];

  // could set number of places, people, etc. but for now let's just build capacity based off space and people based off capacity
  //scale is the length of each side of a square grid (20x20 = 400 spots)
  settings.mapScale     = 20;
  settings.squareSize   = 50;
  settings.randomness   = 0.05; //a percentage, e.g. 0.01 = 1%
  settings.numPeople    = 300;

  //Contstructors


  function Place(gridx,gridy) {

    this.category   = sample(seed.placeCategories.category);

    switch (this.category) {
      case 'residential':
        this.name = 'apartment';
        break;
      case 'commercial':
        this.name = sample(seed.companyNames) + sample(seed.companyNames);
        break;
      case 'hangout':
        this.name = sample(seed.hangoutNames);
        break;
      case 'store':
        this.name = sample(seed.storeNames);
        break;
      case 'park':
        this.name = 'the park';
        break;
    }

    this.capacity   = Math.ceil(Math.rand() * 50);
    this.occupants  = 0;
    this.loc.x    = gridx;
    this.loc.y    = gridy;

  }

  function Person() {

    this.gender = sample(['m','f']);
    if (this.gender == 'm') {
      this.name = sample(seed.mNames) + ' ' + sample(seed.lastNames);
    } else {
      this.name = sample(seed.fNames) + ' ' + sample(seed.lastNames);
    }
    this.job = sample(seed.jobs);

    //this.residence_id = sample(Place.residences.sample.id
    //@office_id = Place.offices.sample.id
    //we're temporarily going to set a random position, later we'll add places
    this.pos = {
      x: Math.round(Math.random() * settings.mapScale - (settings.mapScale / 2)) * settings.squareSize,
      y: 0,
      z: Math.round(Math.random() * settings.mapScale - (settings.mapScale / 2)) * settings.squareSize
    };

    function tweenTo(destination) {
      //finish this
      this.tweenObj;
      return this.tweenObj;
    }

  }

  function Job(name, routine, incidence, prosperity) {

    this.name       = name;
    this.routine    = routine;
    this.incidence  = incidence;
    this.prosperity = prosperity;

  }

  // =========================================
  //            set everything up
  // =========================================

  city.startTIme = new Date();

  // populate the grid with places
  for (i = 0; i < settings.mapScale; i++) {
    for (j = 0; j < settings.mapScale; j++) {
      city.places.push( 
        new Place(i,j) 
      );
    }
  }

  // add in peoples' jobs
  for (i = 0; i < seed.jobs.length; i++) {
    city.jobs.push(
      new Job(
        seed.jobs[i].name, 
        seed.jobs[i].routine, 
        seed.jobs[i].incidence, 
        seed.jobs[i].prosperity
      )
    );
  };

  // generate people
  for (i = 0; i < settings.numPeople; i++) {
    //we can get more complex later
    //might create a certain number based on available jobs and housing
    city.people.push(new Person());
  }

  console.log(city);

};

exports.init = init;
