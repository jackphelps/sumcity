
# the city is a grid. 
# the people wake up, go to work, and go home. 
# sometimes, something interesting happens.

require 'ostruct'
require 'eventmachine'
load 'data.rb'
load 'models.rb'

# CONTROLLER

def rando
	return 1 + rand(-$settings.randomness..$settings.randomness)/100
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

def start
	
	# time is a prerequisite for making stuff
	$now = Citytime.new 

	#start the loop
	EventMachine.run do

		generate_places
		generate_jobs
		generate_people
		5.times {puts Person.all.sample.dossier}
		
	end
end
start










