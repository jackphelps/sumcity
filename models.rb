# Models

class Place

	attr_accessor :id, :xy, :category, :capacity, :occupants
	@@all_members = []
	@@id_inc = 0 #should be using a database

	def initialize(xy)
		@id = set_id
		@xy = xy
		@category = $source.place_categories.sample
		@capacity = rand(5..20)
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

	attr_accessor :id, :gender, :name, :age, :residence_id, :office_id, :job_id, :xy, :next, :diary, :shift_today
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
		@age = $source.age_distribution.sample + rand(9) #age dist is weighting of decades, didn't feel like implementing gaussian distribution
		@residence_id = Place.residences.sample.id
		@office_id = Place.offices.sample.id
		@job_id = self.pick_job_id
		@xy = Place.all.find{|p| p.id == @residence_id}.xy #set initial location to residence
		@diary = []
		@next_shift = get_shift
		@current_activity = {:activity=>"sleeping",:until=>self.sleep_til}
		@add_factor = rand(0..$settings.max_add)
		@@all_members << self
	end

	def set_activity=(activity) #setter to record all actions
		@activity = activity
		@diary += [@now.in_words, activity]
	end

	def sleep_til
		return @next_shift[:start].time_to_int - rand(30..120)
	end

	def current_activity
		return @current_activity
	end

	def pick_job_id
		#for each job that fits the person's age, we'll add it to an array of possible jobs once for each "incidence" (how common it is)
		job_chances = []
		for job in Job.all
			if job.age[:min] <= self.age && self.age <= job.age[:max]
				job.incidence.times {job_chances << job.id}
			end
		end
		return job_chances.sample
	end

	def get_job
		return Job.all.find{|j| j.id == self.job_id}
	end

	def get_shift
		job = self.get_job
		return job.shifts.sample if !job.shifts.empty?
	end

	def set_id
		@@id_inc += 1
		return @@id_inc
	end

	def self.all
		return @@all_members
	end

	def dossier
		puts self.name
		puts "age: " + self.age.to_s
		puts "gender: " + self.gender.to_s
		puts "lives at: " + Place.all.find{|p| p.id == self.residence_id}.xy.to_s
		puts "occupation: " + self.get_job.name.to_s
		puts "scheduled to work today at: " + self.shift_today.to_s
		puts "works at: " + Place.all.find{|p| p.id == self.office_id}.xy.to_s
		puts "current activity: " + self.current_activity.to_s
		puts "A.D.D factor: " + self.add_factor.to_s
	end

	def might
		#if current_activity
	end

end

class Job

	attr_accessor :id, :name, :shifts, :street_job, :incidence, :prosperity, :age
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

class Activity

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

class Citytime

	# sped up 60x normal time, 1 second = 1 minute
	
	def initialize
		@start_time = Time.now#start time on load
	end

	def raw
		return Time.now - @start_time
	end

	def minute
		return (self.raw % 60).floor
	end

	def hour
		return ((self.raw / 60) % 24).floor 
	end

	def time_of_day
		return "#{'%02d' % self.hour}:#{'%02d' % self.minute}"
	end

	def day
		return (self.raw / (60 * 24)).ceil # start on day 1, not day 0
	end

	def in_words
		return "#{self.time_of_day} on day #{self.day}"
	end
end


