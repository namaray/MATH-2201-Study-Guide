---
layout: default
title: Vectors & Coordinate Geometry
---

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f4f7f6;
  }
  h1, h2, h3 { color: #2c3e50; }
  h1 { font-size: 2.5rem; border-bottom: 3px solid #f37021; padding-bottom: 10px; margin-bottom: 2rem; }
  h2 { font-size: 1.8rem; margin-top: 2.5rem; color: #2980b9; border-left: 4px solid #2980b9; padding-left: 10px; }
  h3 { color: #d35400; margin-top: 1.5rem; }
  .note-card {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    margin-bottom: 1.5rem;
    border-top: 4px solid #27ae60;
  }
  .highlight { background-color: #ffeaa7; padding: 2px 5px; border-radius: 3px; font-weight: bold; }
  .math-block { text-align: center; margin: 1.5rem 0; font-size: 1.2rem; overflow-x: auto; padding: 10px 0;}
  ul { padding-left: 1.5rem; }
  li { margin-bottom: 0.5rem; }
  .example-box {
    background: #e8f4f8;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #3498db;
    margin: 1.5rem 0;
  }
  .back-btn {
    display: inline-block;
    margin-bottom: 20px;
    padding: 8px 15px;
    background-color: #2c3e50;
    color: white !important;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    transition: background 0.3s;
  }
  .back-btn:hover { background-color: #1a252f; }
</style>

<a href="new-notes-index.html" class="back-btn">← Back to Notes Index</a>

# Vectors and Coordinate Geometry (MATH-2201)

<div class="note-card">
## What is a Vector?
A vector is a mathematical quantity having both **Magnitude** and **Direction**. 
Unlike ordinary numbers (scalars), vectors can fully describe real-world quantities.

**Examples:**
- Velocity
- Force
- Displacement
- Electric / Magnetic Fields
- Acceleration

**Why Do We Study Vectors?**
Vectors help us answer critical questions such as:
- *Where is an object?*
- *In which direction is it moving, and how fast?*
- *What is the shortest path?*
- *What is the resultant force?*
- *How do we rotate a 3D object?*
</div>

## Representation & Position Vectors
Geometrically, a vector is visualized as an arrow. 
- The **length** represents the magnitude.
- The **orientation** represents the direction.

A **Position Vector** is a specific type of vector that defines the location of a point in space relative to an arbitrary reference point (usually the origin).

## Vector Equation of a Line
The vector equation of a line allows us to determine the position of a moving object at any instant. It is widely used in GPS navigation, robotics, computer graphics, and drones.

**General Formula:**
<div class="math-block">
$$ \mathbf{r} = \mathbf{a} + \lambda \mathbf{b} $$
</div>
Where:
- \(\mathbf{r}\) is the position vector of any point on the line.
- \(\mathbf{a}\) is the position vector of a known point through which the line passes.
- \(\mathbf{b}\) is the direction vector of the line.
- \(\lambda\) is a scalar parameter.

### Forms of the Equation
1. **Passing through two known points:**
   <div class="math-block">$$ \mathbf{r} = \mathbf{a} + \lambda (\mathbf{b} - \mathbf{a}) $$</div>
2. **Parametric Form:**
   <div class="math-block">$$ x = a_1 + \lambda b_1 $$</div>
   <div class="math-block">$$ y = a_2 + \lambda b_2 $$</div>
   <div class="math-block">$$ z = a_3 + \lambda b_3 $$</div>
3. **Symmetric Form:**
   <div class="math-block">$$ \frac{x - a_1}{b_1} = \frac{y - a_2}{b_2} = \frac{z - a_3}{b_3} $$</div>
   *(Where direction components \(b_1, b_2, b_3\) are non-zero)*

## Products of Vectors
There are two types of products in vector algebra because two vectors can interact in two different ways.

<div class="note-card">
### 1. Dot (Scalar) Product
Measures how much one vector acts or lies in the direction of another (directional similarity). 
**Produces a scalar (number).**

**Geometric Method:**
<div class="math-block">$$ \mathbf{a} \cdot \mathbf{b} = |\mathbf{a}| |\mathbf{b}| \cos \theta $$</div>

**Algebraic Method:**
For \(\mathbf{a} = a_1\mathbf{i} + a_2\mathbf{j} + a_3\mathbf{k}\) and \(\mathbf{b} = b_1\mathbf{i} + b_2\mathbf{j} + b_3\mathbf{k}\):
<div class="math-block">$$ \mathbf{a} \cdot \mathbf{b} = a_1 b_1 + a_2 b_2 + a_3 b_3 $$</div>
</div>

<div class="note-card" style="border-top-color: #e74c3c;">
### 2. Cross (Vector) Product
Measures the rotational tendency and finds a direction perpendicular to both vectors. 
**Produces a new vector.**

**Geometric Method:**
<div class="math-block">$$ \mathbf{a} \times \mathbf{b} = (|\mathbf{a}| |\mathbf{b}| \sin \theta) \mathbf{n} $$</div>
Where \(\mathbf{n}\) is the unit vector perpendicular to both vectors (Right-Hand Rule).

**Algebraic Method:**
Computed using the determinant of a matrix:
<div class="math-block">
$$ 
\mathbf{a} \times \mathbf{b} = 
\begin{vmatrix} 
\mathbf{i} & \mathbf{j} & \mathbf{k} \\ 
a_1 & a_2 & a_3 \\ 
b_1 & b_2 & b_3 
\end{vmatrix} 
$$
</div>
</div>

<div class="example-box">
**Example Calculation:**
Let \(\mathbf{a} = 2\mathbf{i} - \mathbf{j} + 2\mathbf{k}\) and \(\mathbf{b} = 4\mathbf{i} + \mathbf{j} + 4\mathbf{k}\). 
Angle \(\theta = 29.50^\circ\).

- \(|\mathbf{a}| = \sqrt{2^2 + (-1)^2 + 2^2} = \sqrt{9} = 3\)
- \(|\mathbf{b}| = \sqrt{4^2 + 1^2 + 4^2} = \sqrt{33} \approx 5.745\)

Magnitude of Cross Product:
\( |\mathbf{a} \times \mathbf{b}| = 3 (\sqrt{33}) \sin(29.50^\circ) \approx 3 \times 5.745 \times 0.4924 \approx 8.485 \)
</div>
