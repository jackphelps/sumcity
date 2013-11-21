
# the city is a grid. 
# the people wake up, go to work, and go home. 
# sometimes, something interesting happens.


# make modules & db when stuff is locked down
require 'ostruct'
$settings 					= OpenStruct.new
$source 					= OpenStruct.new

$source.m_names 			= ["Nick", "Ian", "Joe", "Zack", "Dave", "Adam", "Jesse", "Roman", "Stebs", "Justin", "Garrett", "Benji", "Blake", "Najee", "Jamie", "Noah", "Paul", "Spencer", "Sam"]
$source.f_names 			= ["Helena", "Polina", "Janice", "Nina", "Sarah", "Emily", "Deana", "Stephanie", "Jackie", "Anneken", "Amanda", "Marie", "Isabel", "Anna", "Maija", "Jessie", "Inna"]
$source.lastnames 			= ("A".."Z").to_a
$source.place_categories 	= ["residential", "office", "park", "nightlife"]
$source.home_activities		= ["reading a book", "watching TV", "talking on the phone", "napping"]
$source.office_names		= ["Global", "Serv", "Soft", "Tek", "Omni", "Products", "Blue", "American", "International"]
$source.jobs				= [
								{ 	
									:name 			=> "mid-level sotware engineer",
									:routine 		=> [{'10:30' => 'work', '7:30' => 'off'}],
									:incidence 		=> 2,
									:prosperity 	=> 3
								},
								{ 	
									:name 			=> "visual artist",
									:routine 		=> [{'10:30' => 'work', '7:30' => 'off'}],
									:incidence 		=> 3,
									:prosperity 	=> 2
								},
								{ 	
									:name 			=> "banker",
									:routine 		=> [{'9:30' => 'work', '8:30' => 'off'}],
									:incidence 		=> 3,
									:prosperity 	=> 4
								},
								{ 	
									:name 			=> "creative director",
									:routine 		=> [{'9:30' => 'work', '6:30' => 'off'}],
									:incidence 		=> 3,
									:prosperity 	=> 3
								},
								{ 	
									:name 			=> "retail sales associate",
									:routine 		=> [{'9:30' => 'work', '6:30' => 'off'}],
									:incidence 		=> 5,
									:prosperity 	=> 1
								},
								{ 	
									:name 			=> "C-level exective",
									:routine 		=> [{'9:30' => 'work', '6:30' => 'off'}],
									:incidence 		=> 1,
									:prosperity 	=> 5
								},
								{ 	
									:name 			=> "account manager",
									:routine 		=> [{'9:00' => 'work', '5:30' => 'off'}],
									:incidence 		=> 4,
									:prosperity 	=> 2
								},
								{ 	
									:name 			=> "package delivery person",
									:routine 		=> [{'9:00' => 'work', '6:00' => 'off'}],
									:incidence 		=> 2,
									:prosperity 	=> 2
								},
								{ 	
									:name 			=> "police officer",
									:routine 		=> [{'random_hours' => '8'}],
									:incidence 		=> 2,
									:prosperity 	=> 2
								},
								{ 	
									:name 			=> "cab driver",
									:routine 		=> [{'random_hours' => '12'}],
									:incidence 		=> 4,
									:prosperity 	=> 1
								},
								{ 	
									:name 			=> "bartender and server",
									:routine 		=> [{'random_hours' => '8'}],
									:incidence 		=> 3,
									:prosperity 	=> 2
								}
							]

# could set number of places, people, etc. but for now let's just build capacity based off space and people based off capacity
$settings.map_scale 		= 20
$settings.randomness 		= 0.05 #a %, e.g. 0.01 = 1%

# MODELS

class Place

	attr_accessor :id, :xy, :category, :capacity, :occupants
	@@all_members = []
	@@id_inc = 0 #should be using a database

	def initialize(xy)
		@id = set_id
		@xy = xy
		@category = $source.place_categories.sample
		@capacity = rand(5..100) #ONE PERSON PER PLACE NOW TO KEEP IT SIMPLE BEFORE TESTING
		@occupants = 0

		@@all_members << self
	end

	def set_id
		@@id_inc += 1
		return @@id_inc
	end

	def self.all
		return @@all_members
	end

	def self.residences
		return self.all.select {|p| p.category == "residential"}
	end

	def self.open_residences
		return self.all.select {|p| p.category == "residential" && p.capacity > p.occupants}
	end

	def self.offices
		return self.all.select {|p| p.category == "office"}
	end

end

class Person

	attr_accessor :id, :gender, :name, :age, :residence_id, :office_id, :xy
	@@all_members = []
	@@id_inc = 0 #should be using a database

	def initialize
		@id = set_id
		@gender = ["m","f"].sample
		if @gender == "m" 
			@name = $source.m_names.sample + " " + $source.lastnames.sample
		else
			@name = $source.f_names.sample + " " + $source.lastnames.sample
		end

		@residence_id = Place.residences.sample.id
		@office_id = Place.offices.sample.id
		@xy = Place.all.find{|s| s.id == @residence_id}.xy #set initial location to residence
		@@all_members << self
	end

	def set_id
		@@id_inc += 1
		return @@id_inc
	end

	def self.all
		return @@all_members
	end

end

class Job

	attr_accessor :id, :name, :routine, :incidence, :prosperity
	@@all_members = []
	@@id_inc = 0
	
	def initialize(job)
		@id = set_id
		job.each do |k,v| 
			self.instance_variable_set("@#{k}",v)
		end
		@@all_members << self
	end

	def set_id
		@@id_inc += 1
		return @@id_inc
	end

	def self.all
		return @@all_members
	end
end

# CONTROLLER

def rando
	return 1 + rand(-randomness..randomness)/100
end

def generate_places
	for x in (1..$settings.map_scale)
		for y in (1..$settings.map_scale)
			Place.new({:x=>x, :y=>y})
		end
	end
end

def generate_jobs
	for job in $source.jobs
		Job.new(job)
	end
end

def generate_people
	num_people = 0
	Place.residences.each{|p| num_people += p.capacity - p.occupants}
	num_people.times {Person.new}
end

def now_raw
	return Time.now - $settings.start_time
end

def now_hour
	return now_raw % 3600 #(60*60)
end

def now_day
	return now_raw % 86400 #(60*60*24)
end

def make_city
	generate_places
	generate_jobs
	generate_people
end

def run_city
	$settings.start_time = Time.now
end
make_city
puts Job.all.inspect