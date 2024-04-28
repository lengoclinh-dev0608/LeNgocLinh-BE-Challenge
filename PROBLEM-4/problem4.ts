// Iterative Approach
// Iterates through the numbers from 1 to n once => Complexity: O(n) 
function sum_to_n_iterative(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Recursive Approach
// Complexity: O(n), but runtime may be a bit longer due to recursive function calls
function sum_to_n_recursive(n: number): number {
    if (n === 1) {
        return 1;
    }
    return n + sum_to_n_recursive(n - 1);
}

// Closed Form Solution
// Complexity: O(1)
// Directly calculates the sum without iteration, so it is the most efficient, especially for the case of large n
function sum_to_n_closed(n: number): number {
    return (n * (n + 1)) / 2;
}

sum_to_n_iterative(9)
console.log("🚀 ~ sum_to_n_iterative(9):", sum_to_n_iterative(9))
sum_to_n_recursive(9)
console.log("🚀 ~ sum_to_n_recursive(9):", sum_to_n_recursive(9))
sum_to_n_closed(9)
console.log("🚀 ~ sum_to_n_closed(9):", sum_to_n_closed(9))
