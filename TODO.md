TODO
====

Todos.

### General

1. 	Tests
2. 	Makefile
3. 	Examples
4. 	Travis.yml
5. 	npm publish
6. 	individualize
7. 	serverify
8. 	use through2 (?)
9. 	create a flow adventure
10. pipelines (snap together; nyt)
11. if process needs stringified values, transformer( stringify )
12. what should happen when the window size exceeds the piped data length? (mean, var, mva, etc) 
13. move KDE and pdf to separate npmodules
14. flow-server (workerfy)
15. separate test utils into separate files and require separately? Worth it? Maybe not. --> Yes. flow-mock-through-write, flow-mock-through-read, etc.


### Streams

1. 	Moving weighted mean (exp)
2. 	Moving weighted variance
3. 	Mean overlap parameter
4. 	Variance overlap parameter
5. 	Histnd
6. 	MVA should output 2d hist
7. 	Ability to specify value precision (significant digits; flow-sigfig)
8. 	KDE pdfs
9. 	Threshold occurrence (accumulation threshold; like cumulative sum)
10. Threshold count (reduce --> single value output)
11. Threshold binary (see logical below)
12. Threshold alert (tranform)
13. moving threshold occurrence
14. moving threshold
15. moving outliers (use online insertion sort with binsearch; this stream will be cpu expensive)
16. moving iqr
17. moving quantile
18. moving max
19. moving median
20. moving pcc
21. pc analysis
22. moving cov
23. merge independent json streams on a per element basis (see zip below)
24. find first([num])
25. find last([num])
26. sort (insertion sort and sink)
27. aggregate (round-robbin? if value-by-value); also aggregate by chunk (e.g., streamed arrays of, say, 300 elements, which are aggregated element-wise)
28. random emitter (e.g., random sampling; biased coin flip)
29. Poisson emitter (Substack's on-the-fly adjust)
30. Markov generator (setup with initial config (pi, T, length [could be infinite] ) and then pipe )
31. unique (filter?) (value hash; reducer version; emitter version)
32. downsample (input data: [time,value])
33. rate (/s) --> thlorenz; stream-spy? --> flow-velocity? flow-throughput? flow-meta-rate? flow-info-rate? (see flow-info below)
34. convert units (thinking of the pretty-bytes module)
35. simplify find (only 1 filter function needed)
36. sink and then readArray (e.g., wait for 300 values and then stream 301 to end as individual values) --> sink-n-stream
37. unzip and zip; (e.g., array of 3; create 3 separate streams; transforms; merge back to array of 3) --> fan and unfan?
38. flow connectors (tsd, elastic, etc.; flow-from-opentsdb, flow-from-elasticsearch)
39. chunkify (numvalues)
40. flow-info (meta information; flow-tap? flow-inspect? flow-inspector?)
	* count
	* throughput/velocity
	* last val (val and timestamp)
41. chunkify-mean, chunkify-median --> a reduce transform upon receiving chunks: [[],[],[],[],...,[[],[]],...,[]],...
42. geometric mean
43. harmonic mean
44. moving gmean
45. moving hmean
46. moving skewness
47. diff
48. math:
	* log; log is tricky for negative numbers (requires imaginary numbers)
	* mult (factor)
	* div (divisor)
	* add (addend/increment)
	* subtract (subtrahend/decrement)
	* mod (divisor)
	* round
	* floor
	* ceil
	* precision
	* toFixed
	* trig functions(?)
49. auto-corr (sink)
50. logical (matlab-style) --> arbitrary filter function
51. boolean --> 1, truthy; 0, falsy
52. rate --> [t0,v0],[t1,v1]: (t1-t0)/(v1-v0); next, (t2-t1)/(v2-v1); keep previous data point on hand
53. moving kurtosis
54. moving t-test
55. moving g-test
56. moving b-test
57. flow fig
58. eval pdfs over a specified range (min,max) and resolution (num values)
	* flow-gaussian
	* flow-exponential
	* flow-binomial
	* etc.



### Tests

1. 	
2. 	Filters.mOutliers
3. 	Filters.outliers
4. 	Filters.eOutliers
5. 	
6. 	
7. 	
8. 	Stats.kde
9. 	Stats.kurtosis
10. 
11. 
12. 
13. 
14. 
15. Stats.mva
16. Stats.mvariance
17. 
18. 
19. Stats.skewness
20. 
21. 
22. Threshold