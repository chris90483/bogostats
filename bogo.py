import numpy as np
import time

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
		while len(self.data) < newdata.length:
			self.data.append("\n")
		self.data[newdata.length - 3] = str(newdata) + "\n"
		
	def save(self):
		self.data_file.truncate()
		self.data_file.write("\n".join(self.data))
	
	def close(self):
		self.data_file.close()

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
		
		
		