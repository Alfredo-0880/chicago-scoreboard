// Past MLS and NWSL playoff brackets, for the Playoff Picture's past
// seasons. ESPN doesn't mark which of its past MLS and NWSL games were
// playoffs, so these are copied from Wikipedia ("<year> MLS Cup playoffs",
// "<year> National Women's Soccer League season") by
// tools/add-soccer-brackets.py (see the README); add a season with it.
//
// Each series: teams [first, second]; kind "single" (one match), "legs"
// (home and away, decided on goals over both), or "games" (best of three);
// games, each [first's goals, second's goals]; shootouts, each game's
// penalty shootout [first, second] or null; winner, 0 or 1 (the index into
// teams); awayGoals, true when away goals decided it.

const SOCCER_BRACKETS = {
 "MLS": {
  "2005": {
   "rounds": [
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         3,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New England",
        "MetroStars"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         4,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Chicago",
        "D.C. United"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         3
        ],
        [
         1,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "San Jose",
        "Los Angeles"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         2,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        [
         5,
         4
        ]
       ],
       "teams": [
        "Colorado",
        "Dallas"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New England",
        "Chicago"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles",
        "Colorado"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New England",
        "Los Angeles"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2005 MLS Cup playoffs"
  },
  "2006": {
   "rounds": [
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         1,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "D.C. United",
        "New York"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         1,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        [
         2,
         4
        ]
       ],
       "teams": [
        "Chicago",
        "New England"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         2,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        [
         4,
         5
        ]
       ],
       "teams": [
        "Dallas",
        "Colorado"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         0,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Chivas USA",
        "Houston"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "D.C. United",
        "New England"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Colorado",
        "Houston"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         3,
         4
        ]
       ],
       "teams": [
        "New England",
        "Houston"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2006 MLS Cup playoffs"
  },
  "2007": {
   "rounds": [
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         2,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "D.C. United",
        "Chicago Fire"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         0,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New York Red Bulls",
        "New England Revolution"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         0,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Chivas USA",
        "Kansas City Wizards 1"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         1,
         4
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "FC Dallas",
        "Houston Dynamo"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Chicago Fire",
        "New England Revolution"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Kansas City Wizards",
        "Houston Dynamo"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New England Revolution",
        "Houston Dynamo"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2007 MLS Cup playoffs"
  },
  "2008": {
   "rounds": [
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ],
        [
         2,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Columbus Crew",
        "Kansas City Wizards"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         0,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New England Revolution",
        "Chicago Fire"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ],
        [
         0,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Houston Dynamo",
        "New York Red Bulls"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         2,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Real Salt Lake",
        "Chivas USA"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Columbus Crew",
        "Chicago Fire"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York Red Bulls",
        "Real Salt Lake"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Columbus Crew",
        "New York Red Bulls"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2008 MLS Cup playoffs"
  },
  "2009": {
   "rounds": [
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         2,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Columbus Crew",
        "Real Salt Lake"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         0,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New England Revolution",
        "Chicago Fire"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ],
        [
         1,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Los Angeles Galaxy",
        "Chivas USA"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         0,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "Houston Dynamo"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         5,
         4
        ]
       ],
       "teams": [
        "Real Salt Lake",
        "Chicago Fire"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles Galaxy",
        "Houston Dynamo"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         5,
         4
        ]
       ],
       "teams": [
        "Real Salt Lake",
        "Los Angeles Galaxy"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2009 MLS Cup playoffs"
  },
  "2010": {
   "rounds": [
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         1,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New York Red Bulls",
        "San Jose Earthquakes"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         2,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        [
         4,
         5
        ]
       ],
       "teams": [
        "Columbus Crew",
        "Colorado Rapids"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         2,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Los Angeles Galaxy",
        "Seattle Sounders FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ],
        [
         1,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Real Salt Lake",
        "FC Dallas"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "San Jose Earthquakes",
        "Colorado Rapids"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles Galaxy",
        "FC Dallas"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Colorado Rapids",
        "FC Dallas"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2010 MLS Cup playoffs"
  },
  "2011": {
   "rounds": [
    {
     "name": "Play-in round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Colorado Rapids",
        "Columbus Crew"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "FC Dallas",
        "New York Red Bulls"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ],
        [
         2,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "Colorado Rapids"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         1,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Houston Dynamo",
        "Philadelphia Union"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         2,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "LA Galaxy",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         3
        ],
        [
         2,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "Real Salt Lake"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "Houston Dynamo"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Real Salt Lake",
        "LA Galaxy"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Houston Dynamo",
        "LA Galaxy"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2011 MLS Cup playoffs"
  },
  "2012": {
   "rounds": [
    {
     "name": "Knockout round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Chicago Fire",
        "Houston Dynamo"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles Galaxy",
        "Vancouver Whitecaps FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ],
        [
         1,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "Houston Dynamo"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ],
        [
         1,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "D.C. United",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         1,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "San Jose Earthquakes",
        "Los Angeles Galaxy"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         0,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Real Salt Lake",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ],
        [
         1,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Houston Dynamo",
        "D.C. United"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ],
        [
         1,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Los Angeles Galaxy",
        "Seattle Sounders FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Houston Dynamo",
        "Los Angeles Galaxy"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2012 MLS Cup playoffs"
  },
  "2013": {
   "rounds": [
    {
     "name": "Knockout round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Houston Dynamo",
        "Montreal Impact"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "Colorado Rapids"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ],
        [
         1,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New York Red Bulls",
        "Houston Dynamo"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ],
        [
         3,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "New England Revolution"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         3,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Portland Timbers",
        "Seattle Sounders FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         2,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Real Salt Lake",
        "Los Angeles Galaxy"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         1,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Houston Dynamo",
        "Sporting Kansas City"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         4
        ],
        [
         0,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Portland Timbers",
        "Real Salt Lake"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         7,
         6
        ]
       ],
       "teams": [
        "Sporting Kansas City",
        "Real Salt Lake"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2013 MLS Cup playoffs"
  },
  "2014": {
   "rounds": [
    {
     "name": "Knockout round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York Red Bulls",
        "Sporting Kansas City"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "FC Dallas",
        "Vancouver Whitecaps FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ],
        [
         2,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "D.C. United",
        "New York Red Bulls"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         4,
         2
        ],
        [
         3,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New England Revolution",
        "Columbus Crew"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ],
        [
         0,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "FC Dallas"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         5,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "LA Galaxy",
        "Real Salt Lake"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ],
        [
         2,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New York Red Bulls",
        "New England Revolution"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         2,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "LA Galaxy"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New England Revolution",
        "LA Galaxy"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2014 MLS Cup playoffs"
  },
  "2015": {
   "rounds": [
    {
     "name": "Knockout round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Toronto FC",
        "Montreal Impact"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New England Revolution",
        "D.C. United"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "Portland Timbers"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "LA Galaxy",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         1,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Montreal Impact",
        "Columbus Crew SC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "D.C. United",
        "New York Red Bulls"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Portland Timbers",
        "Vancouver Whitecaps FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "FC Dallas"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ],
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Columbus Crew SC",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ],
        [
         2,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Portland Timbers",
        "FC Dallas"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Columbus Crew SC",
        "Portland Timbers"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2015 MLS Cup playoffs"
  },
  "2016": {
   "rounds": [
    {
     "name": "Knockout round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         4
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "D.C. United",
        "Montreal Impact"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Toronto FC",
        "Philadelphia Union"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "Sporting Kansas City"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "LA Galaxy",
        "Real Salt Lake"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         2,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Montreal Impact",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ],
        [
         5,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Toronto FC",
        "New York City FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ],
        [
         1,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "FC Dallas"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         0,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "LA Galaxy",
        "Colorado Rapids"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         2
        ],
        [
         2,
         5
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Montreal Impact",
        "Toronto FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         1,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "Colorado Rapids"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Toronto FC",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2016 MLS Cup playoffs"
  },
  "2017": {
   "rounds": [
    {
     "name": "Knockout round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         1,
         3
        ]
       ],
       "teams": [
        "Atlanta United FC",
        "Columbus Crew SC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         4
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Chicago Fire",
        "New York Red Bulls"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Houston Dynamo",
        "Sporting Kansas City"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         5,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Vancouver Whitecaps FC",
        "San Jose Earthquakes"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         4,
         1
        ],
        [
         0,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Columbus Crew SC",
        "New York City FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": true,
       "games": [
        [
         1,
         2
        ],
        [
         1,
         0
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New York Red Bulls",
        "Toronto FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         2,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Houston Dynamo",
        "Portland Timbers"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         0,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Vancouver Whitecaps FC",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         0,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Columbus Crew SC",
        "Toronto FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ],
        [
         0,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Houston Dynamo",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Toronto FC",
        "Seattle Sounders FC"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2017 MLS Cup playoffs"
  },
  "2018": {
   "rounds": [
    {
     "name": "Knockout round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York City FC",
        "Philadelphia Union"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         2,
         3
        ]
       ],
       "teams": [
        "D.C. United",
        "Columbus Crew"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "FC Dallas",
        "Portland Timbers"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles FC",
        "Real Salt Lake"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         1,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "New York City FC",
        "Atlanta United FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         0,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Columbus Crew",
        "New York Red Bulls"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         2,
         3
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Portland Timbers",
        "Seattle Sounders FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ],
        [
         2,
         4
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Real Salt Lake",
        "Sporting Kansas City"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ],
        [
         0,
         1
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Atlanta United FC",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         3,
         2
        ]
       ],
       "kind": "legs",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Portland Timbers",
        "Sporting Kansas City"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Atlanta United FC",
        "Portland Timbers"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2018 MLS Cup playoffs"
  },
  "2019": {
   "rounds": [
    {
     "name": "First round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         5,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Toronto FC",
        "D.C. United"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Atlanta United FC",
        "New England Revolution"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         4,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Philadelphia Union",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Minnesota United FC",
        "LA Galaxy"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         4,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "FC Dallas"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Real Salt Lake",
        "Portland Timbers"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York City FC",
        "Toronto FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Atlanta United FC",
        "Philadelphia Union"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         5,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles FC",
        "LA Galaxy"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "Real Salt Lake"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Toronto FC",
        "Atlanta United FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles FC",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Toronto FC",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2019 MLS Cup playoffs"
  },
  "2020": {
   "rounds": [
    {
     "name": "First round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Philadelphia Union",
        "New England Revolution"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         6,
         5
        ]
       ],
       "teams": [
        "Orlando City SC",
        "New York City FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Columbus Crew SC",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Toronto FC",
        "Nashville SC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         3,
         0
        ]
       ],
       "teams": [
        "Sporting Kansas City",
        "San Jose Earthquakes"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Minnesota United FC",
        "Colorado Rapids"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         7,
         8
        ]
       ],
       "teams": [
        "Portland Timbers",
        "FC Dallas"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "Los Angeles FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New England Revolution",
        "Orlando City SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Columbus Crew SC",
        "Nashville SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "Minnesota United FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "FC Dallas",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New England Revolution",
        "Columbus Crew SC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Minnesota United FC",
        "Seattle Sounders FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Columbus Crew SC",
        "Seattle Sounders FC"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2020 MLS Cup playoffs"
  },
  "2021": {
   "rounds": [
    {
     "name": "First round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York City FC",
        "Atlanta United FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Nashville SC",
        "Orlando City SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Philadelphia Union",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Timbers",
        "Minnesota United FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "Vancouver Whitecaps FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         5,
         6
        ]
       ],
       "teams": [
        "Seattle Sounders FC",
        "Real Salt Lake"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         3,
         5
        ]
       ],
       "teams": [
        "New England Revolution",
        "New York City FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         0,
         2
        ]
       ],
       "teams": [
        "Nashville SC",
        "Philadelphia Union"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Colorado Rapids",
        "Portland Timbers"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "Real Salt Lake"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York City FC",
        "Philadelphia Union"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Timbers",
        "Real Salt Lake"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         4,
         2
        ]
       ],
       "teams": [
        "New York City FC",
        "Portland Timbers"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2021 MLS Cup playoffs"
  },
  "2022": {
   "rounds": [
    {
     "name": "First round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York Red Bulls",
        "FC Cincinnati"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York City FC",
        "Inter Miami CF"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "CF Montréal",
        "Orlando City SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "LA Galaxy",
        "Nashville SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         5,
         4
        ]
       ],
       "teams": [
        "FC Dallas",
        "Minnesota United FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         3,
         1
        ]
       ],
       "teams": [
        "Austin FC",
        "Real Salt Lake"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Philadelphia Union",
        "FC Cincinnati"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York City FC",
        "CF Montréal"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles FC",
        "LA Galaxy"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "FC Dallas",
        "Austin FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Philadelphia Union",
        "New York City FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles FC",
        "Austin FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         0,
         3
        ]
       ],
       "teams": [
        "Philadelphia Union",
        "Los Angeles FC"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2022 MLS Cup playoffs"
  },
  "2023": {
   "rounds": [
    {
     "name": "Wild card",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         5,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York Red Bulls",
        "Charlotte FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         4,
         2
        ]
       ],
       "teams": [
        "Sporting Kansas City",
        "San Jose Earthquakes"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Round one",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ],
        [
         1,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        [
         8,
         7
        ]
       ],
       "teams": [
        "FC Cincinnati",
        "New York Red Bulls"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ],
        [
         1,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Philadelphia Union",
        "New England Revolution"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ],
        [
         2,
         4
        ],
        [
         4,
         2
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null,
        null
       ],
       "teams": [
        "Columbus Crew",
        "Atlanta United FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         1,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Orlando City SC",
        "Nashville SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         4
        ],
        [
         1,
         2
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "St. Louis City SC",
        "Sporting Kansas City"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         1,
         1
        ],
        [
         1,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        [
         4,
         5
        ],
        [
         4,
         3
        ]
       ],
       "teams": [
        "Houston Dynamo FC",
        "Real Salt Lake"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         5,
         2
        ],
        [
         1,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Los Angeles FC",
        "Vancouver Whitecaps FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ],
        [
         1,
         3
        ],
        [
         1,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null,
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "FC Dallas"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "FC Cincinnati",
        "Philadelphia Union"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Columbus Crew",
        "Orlando City SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Sporting Kansas City",
        "Houston Dynamo FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles FC",
        "Seattle Sounders FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "FC Cincinnati",
        "Columbus Crew"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Houston Dynamo FC",
        "Los Angeles FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Columbus Crew",
        "Los Angeles FC"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2023 MLS Cup playoffs"
  },
  "2024": {
   "rounds": [
    {
     "name": "Wild card",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         4,
         5
        ]
       ],
       "teams": [
        "CF Montréal",
        "Atlanta United FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         5,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Vancouver Whitecaps FC",
        "Portland Timbers"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Round one",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         1,
         2
        ],
        [
         2,
         3
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null,
        null
       ],
       "teams": [
        "Inter Miami CF",
        "Atlanta United FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ],
        [
         0,
         0
        ],
        [
         1,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        [
         1,
         3
        ],
        [
         4,
         1
        ]
       ],
       "teams": [
        "Orlando City SC",
        "Charlotte FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         1,
         3
        ],
        [
         0,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null,
        [
         5,
         6
        ]
       ],
       "teams": [
        "FC Cincinnati",
        "New York City FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         2,
         2
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        [
         4,
         5
        ]
       ],
       "teams": [
        "Columbus Crew",
        "New York Red Bulls"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         0,
         3
        ],
        [
         1,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null,
        null
       ],
       "teams": [
        "Los Angeles FC",
        "Vancouver Whitecaps FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         1,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        [
         5,
         4
        ],
        [
         7,
         6
        ]
       ],
       "teams": [
        "Seattle Sounders FC",
        "Houston Dynamo FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         1,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        [
         4,
         5
        ],
        [
         1,
         3
        ]
       ],
       "teams": [
        "Real Salt Lake",
        "Minnesota United FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         5,
         0
        ],
        [
         4,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "LA Galaxy",
        "Colorado Rapids"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Atlanta United FC",
        "Orlando City SC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York City FC",
        "New York Red Bulls"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Los Angeles FC",
        "Seattle Sounders FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         6
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Minnesota United FC",
        "LA Galaxy"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Orlando City SC",
        "New York Red Bulls"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Sounders FC",
        "LA Galaxy"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York Red Bulls",
        "LA Galaxy"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2024 MLS Cup playoffs"
  },
  "2025": {
   "rounds": [
    {
     "name": "Wild card",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Chicago Fire FC",
        "Orlando City SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Timbers",
        "Real Salt Lake"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Round one",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ],
        [
         3,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        [
         4,
         2
        ],
        null
       ],
       "teams": [
        "Philadelphia Union",
        "Chicago Fire FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ],
        [
         0,
         0
        ],
        [
         1,
         3
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        [
         7,
         6
        ],
        null
       ],
       "teams": [
        "Charlotte FC",
        "New York City FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ],
        [
         1,
         2
        ],
        [
         4,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null,
        null
       ],
       "teams": [
        "Inter Miami CF",
        "Nashville SC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ],
        [
         0,
         4
        ],
        [
         2,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null,
        null
       ],
       "teams": [
        "FC Cincinnati",
        "Columbus Crew"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         2,
         2
        ],
        [
         4,
         0
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        [
         2,
         3
        ],
        null
       ],
       "teams": [
        "San Diego FC",
        "Portland Timbers"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         0
        ],
        [
         2,
         4
        ],
        [
         3,
         3
        ]
       ],
       "kind": "games",
       "shootouts": [
        [
         3,
         2
        ],
        null,
        [
         7,
         6
        ]
       ],
       "teams": [
        "Minnesota United FC",
        "Seattle Sounders FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ],
        [
         4,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        null
       ],
       "teams": [
        "Los Angeles FC",
        "Austin FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ],
        [
         1,
         1
        ]
       ],
       "kind": "games",
       "shootouts": [
        null,
        [
         4,
         2
        ]
       ],
       "teams": [
        "Vancouver Whitecaps FC",
        "FC Dallas"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Conference semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Philadelphia Union",
        "New York City FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         4,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Inter Miami CF",
        "FC Cincinnati"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "San Diego FC",
        "Minnesota United FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         3,
         4
        ]
       ],
       "teams": [
        "Los Angeles FC",
        "Vancouver Whitecaps FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Conference finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         5
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "New York City FC",
        "Inter Miami CF"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "San Diego FC",
        "Vancouver Whitecaps FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "MLS Cup",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Inter Miami CF",
        "Vancouver Whitecaps FC"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2025 MLS Cup playoffs"
  }
 },
 "NWSL": {
  "2014": {
   "rounds": [
    {
     "name": "Semi-finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Reign FC",
        "Washington Spirit"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "FC Kansas City",
        "Portland Thorns FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Reign FC",
        "FC Kansas City"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2014 National Women's Soccer League season"
  },
  "2015": {
   "rounds": [
    {
     "name": "Semi-finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Reign FC",
        "Washington Spirit"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         3
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Chicago Red Stars",
        "FC Kansas City"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Seattle Reign FC",
        "FC Kansas City"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2015 National Women's Soccer League season"
  },
  "2016": {
   "rounds": [
    {
     "name": "Semi-finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         4
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Thorns FC",
        "Western New York Flash"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Washington Spirit",
        "Chicago Red Stars"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         3,
         2
        ]
       ],
       "teams": [
        "Western New York Flash",
        "Washington Spirit"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2016 National Women's Soccer League season"
  },
  "2017": {
   "rounds": [
    {
     "name": "Semi-finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         4,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Thorns FC",
        "Orlando Pride"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "North Carolina Courage",
        "Chicago Red Stars"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Thorns FC",
        "North Carolina Courage"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2017 National Women's Soccer League season"
  },
  "2018": {
   "rounds": [
    {
     "name": "Semi-finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "North Carolina Courage",
        "Chicago Red Stars"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Thorns FC",
        "Seattle Reign FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "North Carolina Courage",
        "Portland Thorns FC"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2018 National Women's Soccer League season"
  },
  "2019": {
   "rounds": [
    {
     "name": "Semi-finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         4,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "North Carolina Courage",
        "Reign FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Chicago Red Stars",
        "Portland Thorns FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         4,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "North Carolina Courage",
        "Chicago Red Stars"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2019 National Women's Soccer League season"
  },
  "2021": {
   "rounds": [
    {
     "name": "First round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Chicago Red Stars",
        "NJ/NY Gotham FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Washington Spirit",
        "North Carolina Courage"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Semi-finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Thorns FC",
        "Chicago Red Stars"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "OL Reign",
        "Washington Spirit"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Chicago Red Stars",
        "Washington Spirit"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2021 National Women's Soccer League season"
  },
  "2022": {
   "rounds": [
    {
     "name": "First round",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Houston Dash",
        "Kansas City Current"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "San Diego Wave FC",
        "Chicago Red Stars"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Semi-finals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "OL Reign",
        "Kansas City Current"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Thorns FC",
        "San Diego Wave FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Kansas City Current",
        "Portland Thorns FC"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2022 National Women's Soccer League season"
  },
  "2023": {
   "rounds": [
    {
     "name": "Quarterfinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "OL Reign",
        "Angel City FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "North Carolina Courage",
        "NJ/NY Gotham FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "San Diego Wave FC",
        "OL Reign"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         0,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Thorns FC",
        "NJ/NY Gotham FC"
       ],
       "winner": 1
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "OL Reign",
        "NJ/NY Gotham FC"
       ],
       "winner": 1
      }
     ]
    }
   ],
   "source": "Wikipedia's 2023 National Women's Soccer League season"
  },
  "2024": {
   "rounds": [
    {
     "name": "Quarterfinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         4,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Orlando Pride",
        "Chicago Red Stars"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Kansas City Current",
        "North Carolina Courage"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Washington Spirit",
        "Bay FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "NJ/NY Gotham FC",
        "Portland Thorns FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         3,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Orlando Pride",
        "Kansas City Current"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         3,
         0
        ]
       ],
       "teams": [
        "Washington Spirit",
        "NJ/NY Gotham FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Orlando Pride",
        "Washington Spirit"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2024 National Women's Soccer League season"
  },
  "2025": {
   "rounds": [
    {
     "name": "Quarterfinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         2
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Kansas City Current",
        "Gotham FC"
       ],
       "winner": 1
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Orlando Pride",
        "Seattle Reign FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         1
        ]
       ],
       "kind": "single",
       "shootouts": [
        [
         3,
         1
        ]
       ],
       "teams": [
        "Washington Spirit",
        "Racing Louisville FC"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Portland Thorns FC",
        "San Diego Wave FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Semifinals",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Gotham FC",
        "Orlando Pride"
       ],
       "winner": 0
      },
      {
       "awayGoals": false,
       "games": [
        [
         2,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Washington Spirit",
        "Portland Thorns FC"
       ],
       "winner": 0
      }
     ]
    },
    {
     "name": "Championship",
     "series": [
      {
       "awayGoals": false,
       "games": [
        [
         1,
         0
        ]
       ],
       "kind": "single",
       "shootouts": [
        null
       ],
       "teams": [
        "Gotham FC",
        "Washington Spirit"
       ],
       "winner": 0
      }
     ]
    }
   ],
   "source": "Wikipedia's 2025 National Women's Soccer League season"
  }
 }
};
