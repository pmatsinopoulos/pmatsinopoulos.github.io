I have read this book and I was really impressed with the simplicity they approach this difficult subject.
Another good name for this would have been `Algorithms at Work`. It is very pragmatic book, with clear statements,
easy to understand and that makes you feel cool when dealing with algorithms, rather than frighten.

I highly recommend this book. It will remind you of stuff that you have done while at CS School, and it will keep
you in shape. You never know when you will need that. I am pretty sure that you will.

Here are my notes and highlights

## Preface ##

- Reading the Preface will make sure that this book is for you, the practitioner of software engineering.
- We all know that theoretical books about algorithms present them in pseudo code that is absolutely difficult, if not impossible to convert to running / production code.
- The intention of the book is to be used frequently by experienced programmers.
- So, the book uses real code. Not pseudo code.
- All the code that accompanies the book is fully tested.
- The code presented on the book is not only a mere transfer for the algorithm to real code, but it is transfer to good, actually well-designed code.
- Authors follow the principle to separate the algorithm from the (any) business domain / vertical problem that this algorithm might be solving. This is very good because it
makes clear to the reader what is the flow / logic of the algorithm without having details in between that are irrelevant and might destruct reader.
- We all like mathematics, but you can have too many when one starts talking about algorithms. Authors prefer to stay on the absolutely necessary.
- Authors provide benchmarking and metrics for all the algorithms they present, in order to support, empirically, the mathematical analysis.

## Chapter 1 - Algorithms Matter ##

- Algorithms matter! Knowing which algorithm to use under which circumstances makes a big difference when we produced software.
- The ability to choose an acceptable algorithm for your needs is a critical skill that any good software developer should have.
- You don't have to invent new algorithms, but you do need to understand which algorithms fit the problem at hand.

## Chapter 2 - The Mathematics of Algorithms ##

- Authors lay the foundation for the necessary mathematics that will be used throughout the rest of the book.
- The Size of the Problem Instance plays significant role to the execution time of a program.
- Designing efficient algorithms starts with the proper representation of the data set / structure.
- Algorithm researchers accept that performance costs that differ by a multiplicative constant are asymptotically equivalent. This assumption serves well when comparing algorithms.
- Represent the rate of growth of the algorithm execution time as a function of the size of the input problem instance.
- We get explanation about why SEQUENTIAL SEARCH examines about half of the elements when searching for one.
- For many problems, no single optimal algorithm exists. Choosing an algorithm depends on understanding the problem being solved and the underlying probability distribution of the instances
likely to be treated.
- Algorithms are presented on worst, average and best case.
- The book is using the following performance families / classifications for the algorithms presented:
    * Constant O(1)
    * Logarithmic O(log2(n))
    * Sublinear O(n^d) where d < 1
    * Linear O(n)
    * O(n*log2(n))
    * Quadratic O(n^2)
    * Exponential O(n * 2^n)
- Chapter spends a quite extensive text on each one of these families to analyze it and present it.
- When discussing the logarithmic performance, the binary search is presented.
- When discussing the linear performance, an implementation of an addition algorithm is presented.
- n*log2(n) performance characterizes problems that are solved with the method of divide and conquer and then merge
- When discussing the quadratic performance, we are being presented of an algorithm that does multiplication.
- When discussing the exponential performance, we are being presented of the Euclidean algorithm to calculate the GCD (Greatest Common Divisor)

## Chapter 3 - Patterns and Domains ##

- Patterns is a communication language.
- Authors explain how they are going to use patterns to present and explain the algorithms of this book.
- Chapter explains in detail how authors will be using pattern language to convey the intent and purpose of the algorithm.
- There is also a detailed description about floating point computations and how risky they are to introduce errors.
- A comparison between stack and heap is given. Care should be taken whenever one implements an algorithm. For example, recursive algorithms quickly consume the stack.
- Care should also be taken on the programming language chosen to implement an algorithm and solve a problem. Authors argue that no single language is the right one to
use in all circumstances.

## Chapter 4 - Sorting Algorithms ##

- The chapter presents the most popular sorting algorithms
- No algorithm can do better than O(n*log n) performance in the average and worst case.
- Insertion Sort. With best case O(n), average case O(n^2) and worst case O(n^2). Insertion sort is useful when you have very few elements to sort, or when the initial state is almost sorted.
The optimal performance for insertion sort is when the array is already sorted. When the array is sorted in reverse order, insertion sort exhibits the worst case performance.
We can see the naive implementation and a more performant implementation in C which offers the ability to move blocks of memory content with one command.
- Median Sort. With best and average case O(n*log n), whereas worst case O(n^2). The book explains that the algorithm picks up the median and then transfers all the elements
that are less than the median to the left of it and all the elements that are greater than the median to the right of it, essentially putting the median in the middle
position. The recursively, repeats the same for the left and right part separately. In order to implement this problem, the problem of finding the median and putting that
in the middle, one invokes the help of partition and select_kth. Book explains quite well how this is done, though it is a tough reading. Critical to the performance of the
algorithm is the selection of the pivot index that drives the partition part of the story. Different strategies exist for selecting it and book describes various
approaches. Although we have said above that the worst case performance of median sort is O(n^2), the book gives details and implementation of the BLUM-FLOYD-PRATT-RIVEST-TARJAN
algorithm for selecting the kth element in linear time, and which ensures the worst-case performance to remain on O(n*log n).



