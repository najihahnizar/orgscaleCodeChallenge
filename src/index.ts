function sum_to_n_a(n: number): number {
	// Uses the arithmetic series formula: n(n + 1) / 2
	// Time complexity: O(1), Space complexity: O(1)
	// Fastest approach since it avoids loops and recursion
	return n * (n + 1) / 2;
}

function sum_to_n_b(n: number): number {
	// Iteratively adds numbers from 1 to n
	// Time complexity: O(n), Space complexity: O(1)
	let total = 0;
	for (let i = 1; i <= n; i++) {
		total += i;
	}
	return total;
}

function sum_to_n_c(n: number): number {
	// Base case: sum of 1 is 1
	if (n === 1) {
        return 1;
    }   
	// Recursive case: add n to the sum of (n - 1)
	// Time complexity: O(n), Space complexity: O(n) due to call stack
    return n + sum_to_n_c(n - 1);
}
