
# make modules & db when stuff is locked down
$settings 					= OpenStruct.new
$source 					= OpenStruct.new

$source.m_names 			= ["Nick", "Ian", "Joe", "Zack", "Dave", "Adam", "Jesse", "Roman", "Stebs", "Justin", "Garrett", "Benji", "Blake", "Najee", "Jamie", "Noah", "Paul", "Spencer", "Sam"]
$source.f_names 			= ["Helena", "Polina", "Janice", "Nina", "Sarah", "Emily", "Deana", "Stephanie", "Jackie", "Anneken", "Amanda", "Marie", "Isabel", "Anna", "Maija", "Jessie", "Inna"]
$source.lastnames 			= ("A".."Z").to_a
$source.place_categories 	= ["residential", "office", "park", "nightlife"]
$source.office_names		= ["Global", "Serv", "Soft", "Tek", "Omni", "Products", "Blue", "American", "International"]
$source.age_distribution	= [20,20,20,30,30,30,40,40,40,50,50,60,70,80]
$source.jobs				= [
								{ 	
									:name 			=> "mid-level sotware engineer",
									:shifts			=> [{:start => '10:30', :length => 9}],
									:street_job		=> false,
									:incidence 		=> 2,
									:prosperity 	=> 3,
									:age			=> {:min => 22, :max => 40}
								},
								{ 	
									:name 			=> "visual artist",
									:shifts			=> [{:start => '10:30', :length => 9}],
									:street_job		=> false,
									:incidence 		=> 3,
									:prosperity 	=> 2,
									:age			=> {:min => 19, :max => 40}
								},
								{ 	
									:name 			=> "banker",
									:shifts			=> [{:start => '9:30', :length => 11}],
									:street_job		=> false,
									:incidence 		=> 3,
									:prosperity 	=> 4,
									:age			=> {:min => 22, :max => 50}
								},
								{ 	
									:name 			=> "creative director",
									:shifts			=> [{:start => '9:30', :length => 9}],
									:street_job		=> false,
									:incidence 		=> 3,
									:prosperity 	=> 3,
									:age			=> {:min => 31, :max => 50}
								},
								{ 	
									:name 			=> "retail sales associate",
									:shifts			=> [{:start => '10:00', :length => 9}],
									:street_job		=> false,
									:incidence 		=> 5,
									:prosperity 	=> 1,
									:age			=> {:min => 17, :max => 80}
								},
								{ 	
									:name 			=> "C-level exective",
									:shifts			=> [{:start => '9:30', :length => 9}],
									:street_job		=> false,
									:incidence 		=> 1,
									:prosperity 	=> 5,
									:age			=> {:min => 38, :max => 70}
								},
								{ 	
									:name 			=> "account manager",
									:shifts			=> [{:start => '9:00', :length => 8}],
									:street_job		=> false,
									:incidence 		=> 4,
									:prosperity 	=> 2,
									:age			=> {:min => 20, :max => 65}
								},
								{ 	
									:name 			=> "package delivery person",
									:shifts			=> [{:start => '9:00', :length => 9}],
									:street_job		=> true,
									:incidence 		=> 2,
									:prosperity 	=> 2,
									:age			=> {:min => 22, :max => 65}
								},
								{ 	
									:name 			=> "police officer",
									:shifts			=> [
															{:start => '7:00', :length => 8},
															{:start => '3:00', :length => 8},
															{:start => '23:00', :length => 8}
														],
									:street_job		=> true,
									:incidence 		=> 2,
									:prosperity 	=> 2,
									:age			=> {:min => 20, :max => 65}
								},
								{ 	
									:name 			=> "cab driver",
									:shifts			=> [
															{:start => '7:00', :length => 8},
															{:start => '3:00', :length => 8},
															{:start => '23:00', :length => 8}
														],
									:street_job		=> true,
									:incidence 		=> 4,
									:prosperity 	=> 1,
									:age			=> {:min => 22, :max => 75}
								},
								{ 	
									:name 			=> "EMT",
									:shifts			=> [
															{:start => '7:00', :length => 8},
															{:start => '3:00', :length => 8},
															{:start => '23:00', :length => 8}
														],
									:street_job		=> true,
									:incidence 		=> 1,
									:prosperity 	=> 2,
									:age			=> {:min => 19, :max => 50}
								},
								{ 	
									:name 			=> "bartender",
									:shifts			=> [
															{:start => '11:00', :length => 9},
															{:start => '20:00', :length => 9}
														],
									:street_job		=> false,
									:incidence 		=> 3,
									:prosperity 	=> 2,
									:age			=> {:min => 21, :max => 55}
								},
								{ 	
									:name 			=> "building staff",
									:shifts			=> [
															{:start => '7:00', :length => 8},
															{:start => '3:00', :length => 8}
														],
									:street_job		=> false,
									:incidence 		=> 2,
									:prosperity 	=> 1,
									:age			=> {:min => 18, :max => 70}
								},
								{ 	
									:name 			=> "graduate student",
									:shifts			=> [{:start => '7:30', :length => 7}],
									:street_job		=> false,
									:incidence 		=> 2,
									:prosperity 	=> 1,
									:age			=> {:min => 22, :max => 35}
								},
								{ 	
									:name 			=> "retiree",
									:shifts			=> [],
									:street_job		=> false,
									:incidence 		=> 2,
									:prosperity 	=> 1,
									:age			=> {:min => 55, :max => 999}
								},
								{ 	
									:name 			=> "nanny",
									:shifts			=> [],
									:street_job		=> false,
									:incidence 		=> 2,
									:prosperity 	=> 1,
									:age			=> {:min => 18, :max => 65}
								}
							]
$source.activities 					= [ "sleeping", "working", "eating", "reading a book", "wasting time on the internet", "taking a walk", "drinking", "being social"]

# could set number of places, people, etc. but for now let's just build capacity based off space and people based off capacity
$settings.map_scale 				= 20
$settings.randomness 				= 0.10 #a %, e.g. 0.10 = 10%
$settings.people_to_housing_ratio	= 1.0
$settings.max_add					= 0.10



