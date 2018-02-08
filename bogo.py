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
		
	def bogo(self, arr):
		count = 0
		arr = np.array(arr)
		sorted = np.sort(arr)
		while not np.array_equal(sorted, arr):
			np.random.shuffle(arr)
			count += 1
		
		print("Result: It took " + str(count) + " iterations.")
		return arr
		
	def record(self, newdata):
		#index 0 of data is for length 3
		while len(self.data) < newdata.length - 3:
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
		
		
		