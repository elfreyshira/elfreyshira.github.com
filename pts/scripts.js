$(document).ready(function() {

  var officer_template = $("#officer-template");

  var get_officer_id = function() {
    return function(name) {
      return name.toLowerCase().split(/\W+/).join("");
    };
  };


  if (officer_template[0]) {

    data = {
      officers: [
        {
          title: "President",
          name: "Steven Kanik",
          email: "kanik.steven@gmail.com",
          graduation: "May 2013",
          hometown: "Seoul, Korea",
          interests: "Working out, playing sports, poker, investing",
          interesting_fact: "Living in Korea for 13 years",
          life_ambitions: "To be a senior executive at a major oil & gas company",
          image_file: "steven.jpg"
        },
        {
          title: "Vice President",
          name: "Susan Conover",
          email: "s.conover@utexas.edu",
          graduation: "December 2012",
          hometown: "Denton, Texas",
          interests: "I love to do yoga, read, and exercise and sing in my free time.",
          interesting_fact: "I'm currently learning Portuguese and German.",
          life_ambitions: "Never forget the friends and family who have supported me throughout my life.",
          image_file: "susan.jpg"
        },
        {
          title: "Treasurer",
          name: "Sean Knight",
          email: "seanp2knight@hotmail.com",
          graduation: "December 2012",
          hometown: "Houston, Texas",
          interests: "I love sports, I'm a movie fiend, and also really enjoy music.",
          interesting_fact: "I'm ambidextrous.",
          life_ambitions: "My biggest life ambition is to be rich enough so that I could afford to wear a new pair of socks every day, because I really like how socks feel the first time you put them on.",
          image_file: "sean.jpg"
        },
        {
          title: "Recording Secretary",
          name: "Racher Naylor",
          email: "rachel_naylor@utexas.edu",
          graduation: "May 2013",
          hometown: "Quanah, Texas",
          interests: "Reading, watching movies, knitting",
          interesting_fact: "I spent a month last summer at an archaeological field school in Belize at a Mayan site.",
          life_ambitions: "Find a challenging/exciting/off-beat career path and enjoy life with my friends and family.",
          image_file: "rachel.png"
        },
        {
          title: "Corporate Liaison",
          name: "Paul Tyger",
          email: "paul.tyger@gmail.com",
          graduation: "December 2013",
          hometown: "Houston, Texas",
          interests: "I am very active and pretty social. I am also a bit of a nerd and like to learn about current events, such as the causes and long-standing implications of the 2008 financial crisis and the constitutionality of Obama's healthcare plan.",
          interesting_fact: "I was second in the state and fifth in the nation in high school debate",
          life_ambitions: "I want to end up working for a management consulting firm upon graduation. After doing that for a few years, I am still debating between going to law school or getting an MBA.",
          image_file: "paul.jpg"
        },
        {
          title: "Service Chair",
          name: "Lauren Slattery",
          email: "LaurenAnnSlattery@gmail.com",
          graduation: "May 2013",
          hometown: "San Antonio, Texas",
          interests: "Being outdoors, Hiking, Spending time with my family, Traveling, Skiing",
          interesting_fact: "I attended an opera at the Sydney Opera House in my swimsuit.",
          life_ambitions: "My life ambition is to perfect the art of teleportation.",
          image_file: "lauren.jpg"
        },
        {
          title: "Social Chair",
          name: "Wynn Kopriva",
          email: "wynnkopriva@utexas.edu",
          graduation: "May 2013",
          hometown: "Hurst, Texas",
          interests: "I enjoy rock climbing, basketball, golf, and being outside and active.",
          interesting_fact: 'Kop&#345;&#237;va translates to "stinging nettle" in Czech.',
          life_ambitions: "My life ambition is to run a successful small business and to backpack through Central and South America.",
          image_file: "wynn.jpg"
        },
        {
          title: "Actives Chair",
          name: "Austin Wheeler",
          email: "d28austin@aol.com",
          graduation: "December 2012",
          hometown: "Friendswood, Texas",
          interests: "Kayaking, Traveling, Hunting, Golf, Soccer",
          interesting_fact: "I hunt for reptiles every year with family members who are herpetologist.",
          life_ambitions: "I want to work in the Upstream Oil and Gas Industry for a few years then go back to school for an MBA.",
          image_file: "austin.png"
        },
        {
          title: "Historian",
          name: "John Slimp",
          email: "jaslimp09@gmail.com",
          graduation: "December 2013",
          hometown: "San Antonio, Texas",
          interests: "Helping people, anime and manga, video games",
          interesting_fact: "I'm ambidextrous.",
          life_ambitions: "Make enough money to pay off my and my parents' debts, then give the rest to charity.",
          image_file: "john.jpg"
        },
        {
          title: "Engines Officer",
          name: "Juan Trejo",
          email: "jtrejo13@utexas.edu",
          graduation: "December 2012",
          hometown: "Mexico City, Mexico",
          interests: "Sports, Movies and Music",
          interesting_fact: "Even though I was born and raised in Mexico, I’m not a soccer fan, I don’t usually listen to music in Spanish and I’ve never been drunk in my life.",
          life_ambitions: "To obtain my Masters in the field of TFS at UT, UC Berkeley or Stanford. I then hope to start my own company.",
          image_file: "juan.png"
        },
        {
          title: "SEC Representative",
          name: "Jeff King",
          email: "JAK3819@yahoo.com",
          graduation: "May 2013",
          hometown: "San Antonio, Texas",
          interests: "Sports, traveling, tubing, hanging out with friends, meeting new people, reading",
          interesting_fact: "I lived in South America for a summer in high school",
          life_ambitions: "Work for a exploration and production oil company",
          image_file: "jeff.png"
        },
        {
          title: "Parliamentarian",
          name: "Kevin Reedy",
          email: "reedy.kevin@gmail.com",
          graduation: "December 2013",
          hometown: "The Woodlands, Texas",
          interests: "I am a huge fan of the Game of Thrones series, both the books and the show. My favorite sport to play is Ultimate Frisbee, but I really enjoy watching soccer and baseball. In my spare time I play guitar and trumpet, and I am currently trying to reteach myself piano.",
          interesting_fact: "My family lives in Perth, Australia, which is the exact opposite side of the globe from my hometown.",
          life_ambitions: "I really want to work and live over seas. Who I work for is not as important, as long as I enjoy it.",
          image_file: "kevin.png"
        },
        {
          title: "Webmaster",
          name: "Elfrey Shira",
          email: "elfreyshira@gmail.com",
          graduation: "May 2013",
          hometown: "Arlington, Texas",
          interests: "Trying out new food, programming, football, racquetball, piano",
          interesting_fact: "I've broken a bone by running into a wall.",
          life_ambitions: "Work with a purpose to help others.",
          image_file: "elfrey.jpg"
        }
      ],
      get_id: get_officer_id
    };
    var officer_html = Mustache.to_html(officer_template[0].innerHTML, data);

    $("#container").append($(officer_html).show());

  }

});
