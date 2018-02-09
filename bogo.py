import numpy as np
import time
import random

class Bogo:

	data_file = None
	data = None

	def __init__(self):
		self.data_file = open("bogostats.txt", "r+")
		data_string = self.data_file.read()
		self.data = data_string.split("\n")

	def do_science(self):
		records = []
		for x in range(3, 11):
			for y in range(0, 100):
				records.append(self.bogo(np.random.randint(999, size=x)))
			self.record(Data(x, records))
			records = []
		self.save()

	# the function above this one is lame and not actual science
	def do_proper_science(self, proper: bool, sciences: int) -> bool:
		if proper:
			for science in range(sciences):
				if science == 42:
					return proper | sciences
				elif science == False:
					continue
		else:
			return not proper



	def bogo(self, arr):
		count = 0
		arr = np.array(arr)
		sorted = np.sort(arr)
		while not np.array_equal(sorted, arr):
			np.random.shuffle(arr)
			count += 1
		
		print("Result: It took " + str(count) + " iterations.")
		return count
		
	def record(self, newdata):
		#index 0 of data is for length 3
		while len(self.data) < newdata.length - 2:
			self.data.append("\n")
		self.data[newdata.length - 3] = str(newdata)
		
	def save(self):
		#wipe contents of file
		open("bogostats.txt", 'w').close()
		self.data_file = open("bogostats.txt", 'r+')
		self.data_file.write("\n".join(self.data))
		self.data_file.close()

	def test(self):
		for x in range(0, 7):
			self.record(Data(random.randint(3, 8), np.random.randint(999, size=10)))
		self.save()

class Data:
		
		length = 0
		records = []
		
		def __init__(self, length, records):
			self.length = length
			self.records = records
			
		def __str__(self):
			string = str(self.length) + " : "
			for record in self.records:
				string += str(record) + " "
			return string
		
		
		