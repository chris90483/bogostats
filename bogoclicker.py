from tkinter.tix import ComboBox

import numpy as np
from tkinter import *

class BogoClicker:

    score = 0
    std_arr = [0,1,2,3]
    root = Tk()

    # bogo
    def bogo(self):
        np.random.shuffle(self.std_arr)

    # to do: trees, heaps, bubble, merge and linear?
    def isSorted(self, array):
        for i in range(len(array) - 1):
            if array[i+1] < array[i]:
                return False
        return True

    def click(self):
        return self.isSorted(self.bogo())

    def arr_to_str(self, array):
        result = "["
        for i in range(len(array)-1):
            result += str(array[i]) + " ,"
        result += (str(array[len(array)-1]) + "]")
        return result

    def interface(self):
        self.frame = Frame(self.root) #width=100, height=100)
        self.frame.pack()

        self.score_label = Label(self.root, text="Score: " + str(self.score))
        self.score_label.pack()

        self.current_array = Label(self.root, text=self.arr_to_str(self.std_arr))
        self.current_array.pack()

        self.b = Button(self.root, text="Sort", command=self.callback)
        self.b.pack()

        self.root.mainloop()

    def callback(self):
        self.bogo()
        self.current_array['text'] = self.arr_to_str(self.std_arr)

        if self.isSorted(self.std_arr):
            self.score += 1
            self.score_label['text'] = "Score: " + str(self.score)


bs = BogoClicker()
bs.interface()