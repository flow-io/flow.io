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
16. all simulators should have start, pause, stop logic and an interval parameter


### Streams

1. 	Moving weighted mean (exp; wmean)
2. 	Moving weighted variance (wvar)
3. 	Mean overlap parameter
4. 	Variance overlap parameter
5. 	Histnd
6. 	MVA should output 2d hist (or no, just stream to histnd; in which case, call flow-mean-variance; or yes, mva, but make a stream pipeline: mean-variance pipe histnd)
7. 	Ability to specify value precision (significant digits; flow-sigfig)
8. 	KDE pdfs
9. 	Threshold occurrence (accumulation threshold; like cumulative sum)
10. Threshold count (reduce --> single value output)
11. Threshold binary (see logical below)
12. Threshold alert (transform)
13. moving threshold occurrence
14. moving threshold
15. moving outliers (use online insertion sort with binsearch; this stream will be cpu expensive)
16. moving iqr
17. moving quantile
18. file loopback (infinite read; configurable start, pause, end)
19. moving median
20. moving pcc
21. pc analysis
22. moving cov
23. merge independent json streams on a per element basis (see zip below)
24. find first([num]) --> could make this and #25 part of find; optional parameters: 'first|last', [number]
25. find last([num])
26. sort (insertion sort and sink)
27. aggregate (round-robbin? if value-by-value); also aggregate by chunk (e.g., streamed arrays of, say, 300 elements, which are aggregated element-wise)
28. random emitter (e.g., random sampling; biased coin flip) (see #39)
29. Poisson emitter (Substack's on-the-fly adjust) (simulator)
30. Markov generator (setup with initial config (pi, T, length [could be infinite] ) and then pipe ) --> could also emit on an interval; use setTimeout and have start, pause, stop logic. (simulator)
31. unique (filter?) (value hash [value: time]; reducer version; emitter version) --> will need a max num values parameter; once limit reached, cull oldest values (see Issacs)
32. downsample (input data: [time,value])
33. rate (/s) --> thlorenz; stream-spy? --> flow-velocity? flow-throughput? flow-meta-rate? flow-info-rate? (see flow-info below)
34. convert units (thinking of the pretty-bytes module) --> params: input units, output units; e.g., 'm', 'km'; SI and Imperial units --> create separate module containing units dictionary (convert-units; unit-converter; units; units.io)
35. simplify find (only 1 filter function needed)
36. sine wave simulator (period, amplitude)
37. unzip and zip; (e.g., array of 3; create 3 separate streams; transforms; merge back to array of 3) --> fan and unfan?
38. flow connectors (tsd, elastic, etc.; flow-from-opentsdb, flow-from-elasticsearch) --> wrapper for opentsdb.js
39. uniform random variates source simulator (as demo, use flow.add() to set the mean)
40. flow-info (meta information; flow-tap? flow-inspect? flow-inspector?)
	* count
	* throughput/velocity
	* last val (val and timestamp)
41. chunk-median
42. geometric mean (gmean)
43. harmonic mean (hmean)
44. moving gmean
45. moving hmean
46. moving skewness
47. validation --> allow pass through for valid data; allow user-defined behavior when validation not met (e.g., kill stream, emit error message, pipe invalid data to separate stream (fork stream), etc)
	* object
		+ properties
		+ prop value validation
	* array
		+ length
		+ content-type
		+ ndarray (typed arrays)
	* boolean
	* numeric
	* string
	* date/time
	* arbitrary (filter)
48. math:
	* log; log is tricky for negative numbers (requires imaginary numbers)
	* mod (divisor)
	* precision
	* toFixed
	* trig functions(?)
49. auto-corr (sink)
50. logical (matlab-style) --> arbitrary filter function
51. boolean --> 1, truthy; 0, falsy
52. rate --> [t0,v0],[t1,v1]: (v1-v0)/(t1-t0); next, (v2-v1)/(t2-t1); keep previous data point on hand
53. moving kurtosis
54. moving t-test
55. moving g-test
56. moving b-test
57. flow fig
58. eval pdfs over a specified range (min,max) and resolution (num values)
	* flow-gaussian
	* flow-exponential
	* flow-binomial
	* flow-beta
	* flow-gamma
	* etc.
59. binarysearch (initialize with array of values; find index of array value matching streamed value)
60. binsearch (see hist)
61. moving normality test
62. birch
63. sliding dft
64. bloom filter
65. moving frequency --> moving window; count item frequency; emit array.
66. chunked frequency
67. frequency --> reduce stream; hash with count
68. replay --> stream data to transform stream; as data streams, simply pass through while also writing data to file (cache; newline delimited text); once data source ends, replay the data continuously (node-byline); pause, stop (clear cache), start.
69. coefficient of variation
70. throttle (emit data on time interval; e.g., every 10 secs; alternatively, only emit event when no other data is received for some time interval following first data)




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