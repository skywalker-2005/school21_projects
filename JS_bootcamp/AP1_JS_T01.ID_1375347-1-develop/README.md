# Project 01 — JavaScript\_Bootcamp

**Summary**: In this project, you'll get acquainted with the basics of the JavaScript language.

💡 [Click here](https://new.oprosso.net/p/4cb31ec3f47a4596bc758ea1861fb624) to give us feedback on this project. It’s anonymous and helps us improve the learning process. We recommend filling out the form right after completing the project.


## Table of Contents

  - [Chapter I](#chapter-i)
  - [Instructions](#instructions)
  - [Chapter II](#chapter-ii)
  - [General Information](#general-information)
    - [Topics to study:](#topics-to-study)
  - [Chapter III](#chapter-iii)
    - [Project: Algorithm Minute](#project-algorithm-minute)
    - [Basic Style Guidelines](#basic-style-guidelines)
  - [Task 0. Creating a Project](#task-0-creating-a-project)
  - [Task 1. Creating a Range](#task-1-creating-a-range)
  - [Task 2. Finding Two Numbers That Add Up to a Given Sum](#task-2-finding-two-numbers-that-add-up-to-a-given-sum)
  - [Task 3. Finding the GCD](#task-3-finding-the-gcd)
  - [Task 4. Finding Prime Numbers](#task-4-finding-prime-numbers)
  - [Task 5. Scheduled Meeting](#task-5-scheduled-meeting)
  - [Task 6. Caesar Cipher](#task-6-caesar-cipher)
  - [Task 7. Simple Moving Average](#task-7-simple-moving-average)
  - [Task 8. Merge Sort](#task-8-merge-sort)
  - [Task 9. Binary Search](#task-9-binary-search)
  - [Task 10. Finding the Longest Sequence of Zeros](#task-10-finding-the-longest-sequence-of-zeros)

## Chapter I

## Instructions

1. Throughout the course, you'll often feel uncertainty and a lack of information — that's normal. Remember: the repository, Google, your peers, and Rocket.Chat are always with you. Communicate. Search. Rely on common sense. Don’t be afraid to make mistakes.
2. Be critical of your sources. Verify. Think. Analyze. Compare.
3. Read the tasks carefully. Read them several times.
4. It's a good idea to read the examples attentively as well. They may contain important details that are not explicitly stated in the task.
5. You may encounter inconsistencies where new conditions or examples contradict what you already know. If you do — try to figure it out. If you can’t — write it down in the open questions and resolve it along the way. Don’t leave open questions unresolved.
6. If the task seems unclear or impossible — it just seems that way. Try breaking it down. Most likely, individual parts will become clearer.
7. You’ll face a wide variety of tasks. Those marked with an asterisk (\*) are for the curious. They are more complex and optional. But if you complete them, you’ll gain additional knowledge and experience.
8. Don’t try to cheat the system or others. You’ll only be cheating yourself.
9. Got a question? Ask the peer on your right. If that doesn’t help — ask the peer on your left.
10. When getting help — always make sure you understand why, how, and what for. Otherwise, the help won’t be meaningful.
11. Always push only to the develop branch! The master branch will be ignored. Work in the src directory.
12. Your directory must not contain any files other than those specified in the tasks.

## Chapter II

## General Information

JavaScript is a high-level, interpreted programming language commonly used to create interactive web pages. It allows developers to add dynamic behavior to websites, making them more responsive and engaging for users.

JavaScript was created by Brendan Eich in 1995 and was initially developed for use in the Netscape Navigator browser. Over the years, JavaScript has become one of the most widely used programming languages, now supported by all modern browsers.

The name “JavaScript” originated as a marketing trick, aiming to promote the language as a lighter-weight alternative to the more well-known Java. The language was initially designed for Java developers, and the word “script” referred to small, simplified programs. Before settling on its official name, Brendan Eich temporarily called it *Mocha*, and within Netscape, the internal name *LiveScript* was used.

JavaScript started with very limited functionality, intended mainly to bring a bit of interactivity to web pages. Early uses included handling button clicks and performing simple tasks related to UI elements.

However, with the development of web technologies, the introduction of HTML5, and the emergence of Node.js, JavaScript has gained much broader capabilities. Today, JavaScript remains a key tool for building client-side web applications, offering significantly more functionality.

JavaScript has also found its place in server-side development. Previously, building server applications required technologies such as PHP, ASP.NET, Ruby, or Java. With the appearance of Node.js, it became possible to handle server requests using JavaScript.

Thanks to frameworks like Electron, JavaScript can be used to create desktop applications. In recent years, JavaScript has been increasingly adopted in mobile development, where growing device power and the widespread adoption of HTML5 make it viable for building applications for smartphones, tablets, and desktop computers.

JavaScript is also used in embedded systems programming, particularly in the Internet of Things (IoT) domain. This means JavaScript can be used to program various “smart” devices that interact with the internet.

Thus, JavaScript spans many domains. Today, it is one of the most popular programming languages, continuously expanding its reach and applications in various fields of software development.

From the very beginning, JavaScript had multiple implementations across different browsers (e.g., Netscape, Internet Explorer), which led to the creation of the ECMAScript standard to unify the language. The terms *JavaScript* and *ECMAScript* are largely interchangeable and refer to the same language. However, it’s important to understand that there are no separate versions of JavaScript in real-world use — there is only one official version, governed by the TC39 and ECMA standards bodies.

The development and standardization of the JavaScript language are overseen by the TC39 technical steering committee. The committee’s main task is to create the official language specification. Members meet regularly to vote on agreed-upon changes, which are then passed to ECMA (the standards organization).

The TC39 committee includes 50 to 100 representatives from various companies (such as Mozilla, Google, Apple, Samsung, and others). All members are volunteers, although many are employed by these companies and may receive partial compensation for their work in the committee. Meetings are held every two months and last about three days. Participants report on their work, vote on proposals, and discuss ongoing issues. Each proposal passes through five stages, from Stage 0 to Stage 4.

New ECMAScript standards are periodically released to reflect the language’s evolution. The most recent standard is ECMAScript 2023, adopted in June 2023. However, implementing new standards in browsers takes time, and different browsers may support them at different paces.

**Key advantages of JavaScript:**

- JavaScript can easily interact with HTML elements and CSS styles, enabling dynamic content and style changes on web pages.
- It allows the creation of interactive web applications where users can interact with content, perform actions, submit data, and receive feedback without reloading the page.
- Using AJAX (Asynchronous JavaScript and XML), JavaScript enables asynchronous server requests, improving performance and user experience.
- JavaScript is supported by most modern browsers, making it a universal tool for web application development. But it’s not limited to the web: with the right tools, it can also be used to build games, mobile apps, and even desktop applications.
- There are many libraries and frameworks — the most popular include React, Angular, and Vue.js — that simplify the creation of complex web applications and state management.
- JavaScript has relatively simple syntax, making it beginner-friendly. At the same time, it offers advanced capabilities for experienced developers.
- To run JavaScript code, a special host environment is required. This means the language can run almost anywhere — even on a kettle or microwave. For example, with the advent of Node.js, JavaScript can also be used to build server-side applications, providing a unified programming language for both client and server parts of a web app.
- JavaScript is a multi-paradigm language. It supports several programming styles simultaneously.

### Topics to study:

- Entry point and structure of a program;
- Compilation/interpretation of a program;
- Control structures (sequence, branching, iteration);
- Primitive data types (purpose, size, memory representation, operations);
- Input/output organization (stdin-stdout);
- Automatic, static, and dynamic memory management, garbage collector;
- Complex data structures (templates and generics).

## Chapter III

### Project: Algorithm Minute

This section introduces the core features of the JavaScript language through a project that implements useful algorithms for solving everyday tasks.

**Note**: Each task should be implemented as a separate project.
For example:
`T01/src/exercise0`,
`T01/src/exercise1`,
...
`T01/src/exerciseN-1`,
where **N** is the total number of tasks.

If a previous task is required for the next one, simply copy the previous project into the next task's directory and continue working within it.

### Basic Style Guidelines

- Use the **ES2015+ (ES6+)** specification for solving tasks.
- All variables, if required for a task, must be declared using const or let.
- A function declared using a function declaration should be formatted as follows:

```javascript
function add(a, b) {
  return a + b;
}
```

- All expressions must end with a semicolon `;`.
- The indentation should be two spaces.

## Task 0. Creating a Project

To run the script files, you'll need any browser and any integrated development environment (IDE).
For example, in this guide, we'll be using **Chrome** as the browser and **Visual Studio Code** as the IDE.

1. Inside the `src` directory, create a folder for the project.
1. Create an HTML file (index.html) and fill it with the following basic structure:

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript introduction</title>
</head>
<body>
    
</body>
</html>

```

3. Inside the directory, create a basic script file (`javascript-introduction/src/script.js`) and add the following content:

javascript

console.log(`%c${document.title} says to you Hello!`, 'background-color: yellow; font-size: larger');

4. To run the script file, connect it to the HTML file by adding the `<script src="src/script.js"></script>` tag **above** the closing `</head>` tag:

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript introduction</title>
    <script src="src/script.js"></script>
</head>
<body></body>
</html>

```

5. To view the result, open the browser's developer tools:
- Press the **`F12`** key.
- Or right-click anywhere on the page and select **`"Inspect"`** from the context menu.

## Task 1. Creating a Range

Complete the range function that generates a range of natural whole numbers.

- The function takes two arguments:
  the first — the starting number of the range,
  the second — the ending number of the range.
- The function returns the result as an array of the generated numbers.
- It is guaranteed that the arguments will be zero or positive integers.

```javascript

function range(start, end) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------|
|  0 5                                                         | [0,1,2,3,4,5]     |
|  3 3                                                         | [3]               |
|  8 0                                                         | []                |
|  0 0                                                         | [0]               |

## Task 2. Finding two numbers that sum to a target

Write a function that takes an array of natural integers as the first argument and a target number as the second argument — a sum that can potentially be formed by adding some of the numbers from the array.

- The function should return an array with the two indices of the numbers that make up the target sum.
  If no such pair exists, the function should return null.
- The sum can be formed by **any combination** of numbers in the array.
- It is guaranteed that the array will contain more than one element.

```javascript

function getNumbersIdBySum(arrayOfNumbers, sum) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------|
|  [1,2,3,4,5]  6                                              | [0, 4] / [1, 3]   |
|  [1,0,5] 2                                                   | null              |
|  [1, 0] 1                                                    | [0, 1]            |
|  [1,2,3,4,5] 0                                               | null              |


## Task 3. Finding the GCD

Write a function that finds the Greatest Common Divisor (GCD) of two non-negative natural integers passed as the first and second parameters, using **Euclid’s algorithm**.

```javascript

function getNOD(first, second) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------|
|  3 6                                                         | 3                 |
|  0 2                                                         | 2                 |
|  5 5                                                         | 5                 |
|  1 3                                                         | 1                 |
|  0 0                                                         | 0                 |

## Task 4. Finding Prime Numbers 

Write a function that finds all natural prime integers using the **Sieve of Eratosthenes** algorithm.

- The function takes a tuple as its argument, where the first element is the start of the range (no less than 2), and the second is the end of the range (also no less than 2).
- The function returns a new array of prime numbers.

```javascript

function getSimpleNumbers(touple) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------|
|  [2, 10]                                                     | [2, 3, 5, 7]      |
|  [2, 2]                                                      | [2]               |


## Task 5. Scheduled Meeting

Write a function that receives a meeting start time in 24-hour format as the first argument (as a string), and the meeting duration in minutes as the second argument.

- The function should return true if the meeting falls entirely within the working day.
  If the meeting exceeds working hours, return false.
- Working hours are defined arbitrarily as follows:

```javascript

const dayStart = "07:30" // начало дня
const dayEnd = "17:45" // конец дня;

function scheduleMeeting(startTime, durationMinutes) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------|
|  "07:30" 15                                                  | true              |
|  "07:15" 30                                                  | false             |
|  "7:30"  30                                                  | true              |
|  "11:30" 60                                                  | true              |
|  "17:00" 45                                                  | true              |
|  "17:30" 30                                                  | false             |
|  "18:00" 15                                                  | false             |


## Task 6. Caesar Cipher

There is an alphabet consisting of: a, b, c, d, e, f.
Each character from the alphabet can be replaced according to the following rule:
a = def, b = efc, c = abe, d = cba, e = fba, f = dcb.

Write a function that takes a string (consisting of this alphabet) as the first argument and a number (how many times to apply the transformation) as the second.

- The function returns the string after applying the transformations.

```javascript


function alphabetMap(rawString, mapCount) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------|
|  "abcdef" 1                                                  |defefcabecbafbadcb |
|  "aa" 2                                                      |cbafbadcbcbafbadcb |
|  "bad"  1                                                    |efcdefcba          |

## Task 7. Simple Moving Average

Write a function to calculate the simple moving average.

- The first argument is an array of non-negative integers.
- The second argument is the period n to be considered, where n > 0.
- The function should return an array of simple moving averages at each point.
- When a shorter period n' < n is encountered, only the available elements should be used in the average.

```javascript


function sma(arrayOfNumbers, period) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------|
|  [1,2,3] 3                                                   | [0.333, 1 ,2]     |
|  [1,2,3] 1                                                   | [1,2,3]           |
|  [1,2,3] 2                                                   | [0.5, 1.5, 2.5]   |


## Task 8. Merge Sort

Implement merge sort.

- The function takes an array of numbers as an argument.

```javascript


function mergeSort(arrayOfNumbers) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------------|
|  [38, 27, 43, 3, 9, 82]                                      | [3, 9, 27, 38, 43, 82]  |
|  [13, 45, 2, 11, 23, 17]                                     | [2, 11, 13, 17, 23, 45] |
|  [90, 24, 15, 2, 7, 40]                                      | [2, 7, 15, 24, 40, 90]  |

## Task 9. Binary Search

Write a function for binary search of an element in a sorted array.

- The first argument is an array of numbers.
- The second argument is the number to find.
- The function returns the index of the number.

```javascript


function binarySearch(arrayOfNumbers, num) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------------|
|  [1, 2, 3, 4, 5, 6], 4                                       | 3                       |
|  [2, 4, 6, 8, 10], 8                                         | 3                       |
|  [-10, -5, 0, 5, 10], 0                                      | 2                       |


## Task 10. Finding the Longest Sequence of Zeros

Write a function that takes a string of 0s and 1s and returns the length of the longest sequence of 0s.

```javascript


function getMaxZeroCount(raw) {
    // Твой код
}

```

|**Input**|**Output**|
|--------------------------------------------------------------|-------------------------|
|  "1010010001"                                                | 3                       |
|  "100100100"                                                 | 2                       |
|  "11111"                                                     | 0                       |
