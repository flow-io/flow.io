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
9. 	
10. pipelines (snap together; nyt)
11. if process needs stringified values, transformer( stringify )
12. what should happen when the window size exceeds the piped data length? (mean, var, mva, etc) 
13. move KDE and pdf to separate npmodules
14. flow-server (workerfy)


### Streams

1. 	Moving weighted mean (exp)
2. 	Moving weighted variance
3. 	Mean overlap parameter
4. 	Variance overlap parameter
5. 	Histnd
6. 	MVA should output 2d hist
7. 	Ability to specify value precision (significant digits)
8. 	KDE pdfs
9. 	Threshold occurrence (accumulation threshold)
10. Threshold count
11. Threshold binary
12. Threshold alert
13. moving threshold occurrence
14. moving threshold
15. moving outliers
16. moving iqr
17. moving quantile
18. moving max/min/sum
19. moving median
20. moving pcc
21. pc analysis
22. moving cov
23. merge independent json streams on a per element basis
24. find first([num])
25. find last([num])
26. sort (sink)
27. aggregate (round-robbin?)
28. random emitter (e.g., random sampling; biased coin flip)
29. Poisson emitter (Substack's on-the-fly adjust)
30. Markov generator (setup with initial config (pi, T, length [could be infinite] ) and then pipe )
31. unique (filter?) (value hash; reducer version; emitter version)
32. downsample (input data: [time,value])
33. rate (/s) --> thlorenz; stream-spy?
34. connectors (tsd,elastic)
35. simplify find (only 1 filter function needed)
36. sink and then readArray (e.g., wait for 300 values and then stream 301 to end as individual values) --> sink-n-stream
37. unzip and zip; (e.g., array of 3; create 3 separate streams; transforms; merge back to array of 3)
38. flow connectors (tsd, etc.)


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