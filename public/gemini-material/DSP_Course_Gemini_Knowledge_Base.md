# Comprehensive Knowledge Base: Digital Signal Processing (DSP) & Signals & Systems
## Master Curriculum & Academic Knowledge Base for Gemini AI Tutor Gem

---

### Course Metadata & Academic Information
- **Course Name:** Digital Signal Processing (معالجة الإشارات الرقمية) & Signals and Systems (الإشارات والنظم).
- **Institution / Instructors:** Assoc. Prof. Abeer Twakol (د. عبير توكل) & Teaching Staff (Eng. Ahmed Abdelhady, Eng. Ahmed Ramadan).
- **Core Standard Textbooks:**
  1. *Digital Signal Processing: Principles, Algorithms, and Applications* – John G. Proakis & Dimitris G. Manolakis (4th Edition).
  2. *Discrete-Time Signal Processing* – Alan V. Oppenheim & Ronald W. Schafer (3rd Edition).
  3. *Schaum's Outline of Digital Signal Processing* – Monson H. Hayes.
  4. *Schaum's Outline of Signals and Systems* – Hwei P. Hsu.

---

## CHAPTER 1: Fundamentals of Discrete-Time Signals & Systems

### 1. Basic Definitions & Classifications
- **Signal:** A physical quantity that varies with one or more independent variables (usually time $t$ or discrete index $n$) and conveys information.
- **Continuous-Time (CT) Signal $x(t)$:** Defined for all continuum values of time $t \in \mathbb{R}$.
- **Discrete-Time (DT) Signal $x[n]$:** Defined only at integer values of index $n \in \mathbb{Z}$. It is mathematically represented as a sequence of numbers $\{x[n]\}$.
- **Analog Signal:** Both time and amplitude are continuous.
- **Digital Signal:** Both time and amplitude are discrete (quantized into finite discrete levels).
- **Periodic vs Aperiodic DT Signals:**
  - A DT signal $x[n]$ is periodic with fundamental period $N$ ($N \in \mathbb{Z}^+$) if and only if:
    $$x[n + N] = x[n] \quad \forall n \in \mathbb{Z}$$
  - **Important Contrast with Continuous Signals:** A continuous sinusoid $\cos(\Omega_0 t)$ is always periodic for any real frequency $\Omega_0$ with period $T = 2\pi / \Omega_0$. However, a discrete sinusoid $\cos(\omega_0 n)$ is periodic **if and only if** its frequency $\omega_0$ is a rational multiple of $2\pi$:
    $$\frac{\omega_0}{2\pi} = \frac{k}{N} \implies N = \frac{2\pi k}{\omega_0} \quad (k, N \in \mathbb{Z}^+ \text{ and coprime})$$

### 2. Elementary Discrete-Time Sequences
1. **Unit Impulse / Unit Sample Sequence $\delta[n]$:**
   $$\delta[n] = \begin{cases} 1, & n = 0 \\ 0, & n \ne 0 \end{cases}$$
   - Sifting / Sampling Property: $\sum_{n=-\infty}^{\infty} x[n] \delta[n - k] = x[k]$.
   - Any arbitrary signal can be decomposed into an impulse train:
     $$x[n] = \sum_{k=-\infty}^{\infty} x[k] \delta[n - k]$$

2. **Unit Step Sequence $u[n]$:**
   $$u[n] = \begin{cases} 1, & n \ge 0 \\ 0, & n < 0 \end{cases} = \sum_{k=0}^{\infty} \delta[n - k] = \sum_{m=-\infty}^{n} \delta[m]$$
   - Relationship: $\delta[n] = u[n] - u[n-1]$.

3. **Ramp Sequence $r[n]$:**
   $$r[n] = n \cdot u[n] = \begin{cases} n, & n \ge 0 \\ 0, & n < 0 \end{cases}$$

4. **Real Exponential Sequence $x[n] = a^n u[n]$:**
   - If $|a| > 1$: sequence grows unboundedly (exponentially divergent).
   - If $0 < a < 1$: decaying, positive sequence (exponentially convergent).
   - If $-1 < a < 0$: decaying, alternating sequence with oscillating signs.
   - If $a < -1$: growing alternating sequence.

5. **Complex Exponential Sequence:**
   $$x[n] = e^{j \omega_0 n} = \cos(\omega_0 n) + j \sin(\omega_0 n)$$
   - General form with real and imaginary parts: $x[n] = r^n e^{j(\omega_0 n + \theta)}$.

### 3. Basic Discrete-Time Operations
- **Time Shifting:** $y[n] = x[n - n_0]$. If $n_0 > 0$, delay (shifted to the right). If $n_0 < 0$, advance (shifted to the left).
- **Time Reversal (Reflection):** $y[n] = x[-n]$.
- **Time Scaling (Decimation & Interpolation):**
  - Downsampling (Decimation by $M$): $y[n] = x[Mn]$ (keeps every $M$-th sample).
  - Upsampling (Expansion by $L$): inserts $L-1$ zeros between consecutive samples.

### 4. Sampling & Analog-to-Digital Conversion (ADC)
- **The Sampling Process:** $x[n] = x_a(n T_s) = x_a(n / f_s)$, where $T_s$ is the sampling interval and $f_s = 1/T_s$ is the sampling frequency.
- **Nyquist-Shannon Sampling Theorem:** To reconstruct a bandlimited analog signal $x_a(t)$ with maximum frequency $f_{max}$ without aliasing distortion:
  $$f_s \ge 2 f_{max} \quad (\text{or } \Omega_s \ge 2 \Omega_{max})$$
  - The minimum rate $f_{Nyquist} = 2 f_{max}$ is called the **Nyquist rate**.
- **Quantization:**
  - Partitioning continuous amplitudes into $2^b$ discrete levels using a $b$-bit quantizer.
  - Step size: $\Delta = \frac{V_{max} - V_{min}}{2^b}$.
  - Quantization error: $e[n] = x_q[n] - x[n]$, where $-\frac{\Delta}{2} \le e[n] \le \frac{\Delta}{2}$.
  - Quantization noise power (variance): $\sigma_e^2 = \frac{\Delta^2}{12}$.
  - Signal-to-Quantization-Noise Ratio (SQNR):
    $$\text{SQNR (dB)} \approx 6.02 b + 1.76 \text{ dB}$$
    *(Every additional bit adds approximately $6\text{ dB}$ of dynamic range).*

---

## CHAPTER 2: Discrete-Time Systems & LTI Properties

### 1. System Representation & Mathematical Operator
A discrete-time system is a transformation / operator $\mathcal{T}$ that maps an input sequence $x[n]$ into an output sequence $y[n]$:
$$y[n] = \mathcal{T}\{x[n]\}$$

### 2. Fundamental System Properties & Verification Tests
1. **Linearity (Superposition Principle):**
   - The system is linear if and only if it satisfies both Additivity and Homogeneity:
     $$\mathcal{T}\{a x_1[n] + b x_2[n]\} = a \mathcal{T}\{x_1[n]\} + b \mathcal{T}\{x_2[n]\}$$
   - *Test Rule:* Calculate $y_3[n] = \mathcal{T}\{a x_1[n] + b x_2[n]\}$ and compare it with $a y_1[n] + b y_2[n]$. If equal for all inputs and scalar constants $a, b$, the system is linear. Note: Any non-zero constant bias (e.g. $y[n] = 2x[n] + 3$) makes the system **nonlinear** (incrementally linear).

2. **Time-Invariance (Shift-Invariance):**
   - A system is time-invariant if a time shift in the input results in an identical time shift in the output:
     $$x[n - k] \xrightarrow{\mathcal{T}} y[n - k] \quad \forall k \in \mathbb{Z}$$
   - *Test Rule:*
     1. Find response to shifted input: $y(n, k) = \mathcal{T}\{x[n - k]\}$.
     2. Shift output by $k$: $y[n - k]$.
     3. If $y(n, k) \equiv y[n - k]$, then the system is Time-Invariant (TI). If coefficients depend explicitly on $n$ (e.g. $y[n] = n x[n]$) or time-scaling exists ($y[n] = x[2n]$), the system is Time-Varying.

3. **Causality:**
   - A system is causal if the current output $y[n]$ depends only on current and past values of input $\{x[k]\}_{k \le n}$ and past outputs. It does NOT depend on future inputs $\{x[k]\}_{k > n}$.
   - For an LTI system: The system is causal if and only if its impulse response satisfies:
     $$h[n] = 0 \quad \text{for all } n < 0$$

4. **Stability (Bounded-Input Bounded-Output - BIBO):**
   - A system is BIBO stable if every bounded input $|x[n]| \le M_x < \infty$ produces a bounded output $|y[n]| \le M_y < \infty$.
   - **Necessary and Sufficient Condition for LTI System Stability:**
     The impulse response $h[n]$ must be absolutely summable:
     $$\sum_{n=-\infty}^{\infty} |h[n]| < \infty$$

5. **Memory (Memoryless vs Dynamic):**
   - A system is **memoryless (static)** if $y[n]$ depends solely on the input at the exact same instant $n$ (e.g. $y[n] = x^2[n]$).
   - If it depends on past or future values (e.g. $y[n] = x[n-1]$ or $y[n] = \sum_{k=0}^n x[k]$), it has **memory (dynamic)**.

6. **Invertibility:**
   - A system is invertible if distinct inputs produce distinct outputs (one-to-one mapping), allowing the existence of an inverse system $\mathcal{T}^{-1}$ such that $w[n] = \mathcal{T}^{-1}\{\mathcal{T}\{x[n]\}\} = x[n]$.

---

## CHAPTER 3: Linear Convolution Sum & System Analysis

### 1. Derivation of the Convolution Sum
Using the impulse decomposition $x[n] = \sum_{k=-\infty}^{\infty} x[k] \delta[n - k]$ and applying the LTI properties (superposition and time-invariance):
$$y[n] = \mathcal{T}\left\{\sum_{k=-\infty}^{\infty} x[k] \delta[n - k]\right\} = \sum_{k=-\infty}^{\infty} x[k] \mathcal{T}\{\delta[n - k]\}$$
Since $\mathcal{T}\{\delta[n - k]\} = h[n - k]$:
$$y[n] = x[n] * h[n] = \sum_{k=-\infty}^{\infty} x[k] h[n - k]$$

### 2. Properties of Linear Convolution
- **Commutative:** $x[n] * h[n] = h[n] * x[n] = \sum_{k=-\infty}^{\infty} h[k] x[n - k]$.
- **Associative:** $(x[n] * h_1[n]) * h_2[n] = x[n] * (h_1[n] * h_2[n])$.
- **Distributive over Addition:** $x[n] * (h_1[n] + h_2[n]) = x[n] * h_1[n] + x[n] * h_2[n]$.
- **Convolution with Impulse:** $x[n] * \delta[n] = x[n]$, and $x[n] * \delta[n - n_0] = x[n - n_0]$.
- **Length of Linear Convolution:**
  If $x[n]$ has length $L_x$ (from $n = N_1$ to $N_2$) and $h[n]$ has length $L_h$ (from $n = M_1$ to $M_2$), the convolution output $y[n]$ has:
  $$\text{Length } L_y = L_x + L_h - 1$$
  Starting index: $n_{start} = N_1 + M_1$, Ending index: $n_{end} = N_2 + M_2$.

### 3. Step Response $s[n]$
- The response of an LTI system to a unit step input $x[n] = u[n]$:
  $$s[n] = h[n] * u[n] = \sum_{k=-\infty}^{n} h[k]$$
- Recovering impulse response from step response:
  $$h[n] = s[n] - s[n - 1]$$

### 4. Interconnected Systems
- **Cascade (Series) Connection:** $h_{eq}[n] = h_1[n] * h_2[n]$.
- **Parallel Connection:** $h_{eq}[n] = h_1[n] + h_2[n]$.

---

## CHAPTER 4: Linear Constant-Coefficient Difference Equations (LCCDE)

### 1. General Mathematical Formulation
An $N$-th order difference equation relates the input $x[n]$ and output $y[n]$:
$$\sum_{k=0}^{N} a_k y[n - k] = \sum_{m=0}^{M} b_m x[n - m]$$
Normally normalized with $a_0 = 1$:
$$y[n] = -\sum_{k=1}^{N} a_k y[n - k] + \sum_{m=0}^{M} b_m x[n - m]$$

### 2. Total Solution Components
$$y[n] = y_h[n] + y_p[n]$$
1. **Homogeneous (Natural) Solution $y_h[n]$:**
   - Solution to $\sum_{k=0}^N a_k y[n-k] = 0$.
   - Assume solution $y_h[n] = \lambda^n$. Substitute to obtain the characteristic equation:
     $$\lambda^N + a_1 \lambda^{N-1} + a_2 \lambda^{N-2} + \dots + a_N = 0$$
   - For distinct roots $\lambda_1, \lambda_2, \dots, \lambda_N$:
     $$y_h[n] = \sum_{i=1}^N C_i \lambda_i^n$$
   - For repeated root $\lambda_1$ of multiplicity $m$:
     $$y_h[n] = (C_1 + C_2 n + C_3 n^2 + \dots + C_m n^{m-1}) \lambda_1^n$$

2. **Particular (Forced) Solution $y_p[n]$:**
   - Response to the specific driving input $x[n]$ for $n \ge 0$.
   - Selected based on the input form:
     - Constant $x[n] = K \implies y_p[n] = P$ (constant).
     - Exponential $x[n] = K a^n \implies y_p[n] = P a^n$ (if $a$ is not a root of the characteristic equation). If $a = \lambda_i$, then $y_p[n] = P n a^n$.
     - Sinusoid $x[n] = K \cos(\omega_0 n) \implies y_p[n] = P_1 \cos(\omega_0 n) + P_2 \sin(\omega_0 n)$.

3. **System Classification:**
   - **FIR (Finite Impulse Response):** When $a_k = 0$ for all $k \ge 1$ (no feedback). $y[n] = \sum_{m=0}^M b_m x[n-m]$. $h[n]$ has finite duration $M+1$. Always stable.
   - **IIR (Infinite Impulse Response):** At least one $a_k \ne 0$ for $k \ge 1$ (recursive feedback). Impulse response $h[n]$ has infinite duration. Stability depends on roots $\lambda_i$.

---

## CHAPTER 5: Frequency Response of LTI Systems & DTFT

### 1. Discrete-Time Fourier Transform (DTFT)
- **Forward DTFT:**
  $$X(e^{j\omega}) = \sum_{n=-\infty}^{\infty} x[n] e^{-j\omega n}$$
- **Inverse DTFT (IDFT):**
  $$x[n] = \frac{1}{2\pi} \int_{-\pi}^{\pi} X(e^{j\omega}) e^{j\omega n} d\omega$$
- **Periodicity:** $X(e^{j(\omega + 2\pi)}) = X(e^{j\omega})$ (always periodic in frequency with period $2\pi$).

### 2. Frequency Response of an LTI System
$$H(e^{j\omega}) = \sum_{n=-\infty}^{\infty} h[n] e^{-j\omega n} = |H(e^{j\omega})| e^{j \angle H(e^{j\omega})}$$
- **Magnitude Response:** $|H(e^{j\omega})|$ (even function: $|H(e^{-j\omega})| = |H(e^{j\omega})|$ for real $h[n]$).
- **Phase Response:** $\angle H(e^{j\omega}) = \arg H(e^{j\omega})$ (odd function: $\angle H(e^{-j\omega}) = -\angle H(e^{j\omega})$).
- **Steady-State Response to Sinusoidal Input:**
  If $x[n] = A \cos(\omega_0 n + \phi)$, then the steady-state output is:
  $$y_{ss}[n] = A |H(e^{j\omega_0})| \cos(\omega_0 n + \phi + \angle H(e^{j\omega_0}))$$
- **From Difference Equation to Frequency Response:**
  $$H(e^{j\omega}) = \frac{Y(e^{j\omega})}{X(e^{j\omega})} = \frac{\sum_{m=0}^M b_m e^{-j\omega m}}{\sum_{k=0}^N a_k e^{-j\omega k}}$$

---

## CHAPTER 6: The Z-Transform, Region of Convergence (ROC) & System Function

### 1. Definition of the Z-Transform
The bilateral Z-transform of a sequence $x[n]$ is defined as:
$$X(z) = \mathcal{Z}\{x[n]\} = \sum_{n=-\infty}^{\infty} x[n] z^{-n}$$
where $z$ is a complex variable $z = r e^{j\omega}$.
- When evaluated on the unit circle ($r = |z| = 1 \implies z = e^{j\omega}$), the Z-transform reduces to the DTFT:
  $$X(z)\Big|_{z = e^{j\omega}} = X(e^{j\omega})$$

### 2. Region of Convergence (ROC) & Its Fundamental Properties
The ROC is the set of points in the complex z-plane for which the summation $\sum |x[n] z^{-n}|$ converges absolutely.
- **Property 1:** The ROC is a ring or circular disk centered at the origin: $r_R < |z| < r_L$.
- **Property 2:** The ROC cannot contain any poles (points where $X(z) \to \infty$).
- **Property 3 (Right-Sided / Causal Sequence):**
  If $x[n]$ is a right-sided sequence ($x[n] = 0$ for $n < n_0$), the ROC extends outward from the outermost pole:
  $$\text{ROC: } |z| > r_{max}$$
  If causal ($n_0 \ge 0$), the ROC includes $z = \infty$.
- **Property 4 (Left-Sided / Anti-causal Sequence):**
  If $x[n]$ is left-sided ($x[n] = 0$ for $n > n_0$), the ROC extends inward from the innermost pole:
  $$\text{ROC: } |z| < r_{min}$$
  If $n_0 \le 0$, the ROC includes $z = 0$.
- **Property 5 (Two-Sided Sequence):**
  The ROC is an annular ring bounded by two poles: $r_1 < |z| < r_2$.
- **Property 6 (Finite-Duration Sequence):**
  The ROC is the entire z-plane, except possibly $z = 0$ (if $x[n]$ has non-zero values for $n > 0$) or $z = \infty$ (if $x[n]$ has non-zero values for $n < 0$).

### 3. Causality & Stability in the Z-Domain
- **Causality Criterion:** An LTI system is causal if and only if its ROC is exterior to the circle enclosing all its poles, i.e., $|z| > \max_i |p_i|$, and includes $z = \infty$.
- **Stability Criterion (BIBO):** An LTI system is BIBO stable if and only if the ROC of its transfer function $H(z)$ contains the unit circle $|z| = 1$.
- **Causal AND Stable System:** An LTI system that is both causal and BIBO stable must have **ALL its poles strictly inside the unit circle**:
  $$|p_i| < 1 \quad \forall i$$

### 4. Transfer Function & Pole-Zero Representation
$$H(z) = \frac{Y(z)}{X(z)} = \frac{\sum_{m=0}^M b_m z^{-m}}{\sum_{k=0}^N a_k z^{-k}} = b_0 \frac{\prod_{m=1}^M (1 - c_m z^{-1})}{\prod_{k=1}^N (1 - d_k z^{-1})}$$
- **Zeros ($c_m$):** Roots of numerator polynomial ($H(z) = 0$).
- **Poles ($d_k$):** Roots of denominator polynomial ($H(z) \to \infty$).

### 5. Common Z-Transform Pairs
| Sequence $x[n]$ | Transform $X(z)$ | Region of Convergence (ROC) |
|---|---|---|
| $\delta[n]$ | $1$ | Entire z-plane |
| $\delta[n - n_0]$ | $z^{-n_0}$ | All $z$ except $0$ ($n_0>0$) or $\infty$ ($n_0<0$) |
| $u[n]$ | $\frac{1}{1 - z^{-1}} = \frac{z}{z - 1}$ | $|z| > 1$ |
| $-u[-n - 1]$ | $\frac{1}{1 - z^{-1}} = \frac{z}{z - 1}$ | $|z| < 1$ |
| $a^n u[n]$ | $\frac{1}{1 - a z^{-1}} = \frac{z}{z - a}$ | $|z| > |a|$ |
| $-a^n u[-n - 1]$ | $\frac{1}{1 - a z^{-1}} = \frac{z}{z - a}$ | $|z| < |a|$ |
| $n a^n u[n]$ | $\frac{a z^{-1}}{(1 - a z^{-1})^2} = \frac{a z}{(z - a)^2}$ | $|z| > |a|$ |
| $\cos(\omega_0 n) u[n]$ | $\frac{1 - \cos(\omega_0) z^{-1}}{1 - 2\cos(\omega_0) z^{-1} + z^{-2}}$ | $|z| > 1$ |
| $\sin(\omega_0 n) u[n]$ | $\frac{\sin(\omega_0) z^{-1}}{1 - 2\cos(\omega_0) z^{-1} + z^{-2}}$ | $|z| > 1$ |

### 6. Inverse Z-Transform Methods
1. **Partial Fraction Expansion (PFE):**
   - Express $\frac{X(z)}{z}$ as $\sum \frac{A_k}{z - p_k}$, then multiply back by $z$ to get terms of form $\frac{A_k}{1 - p_k z^{-1}}$.
   - Invert each term based on the given ROC (right-sided gives $p_k^n u[n]$, left-sided gives $-p_k^n u[-n-1]$).
2. **Power Series Expansion (Long Division):**
   - Divide polynomials in descending powers of $z$ for causal ROC ($|z| > |p|$), or ascending powers of $z$ for anti-causal ROC ($|z| < |p|$).
3. **Contour Integration (Cauchy's Residue Theorem):**
   $$x[n] = \frac{1}{2\pi j} \oint_C X(z) z^{n-1} dz = \sum \text{Residues of } [X(z) z^{n-1}] \text{ inside } C$$

---

## CHAPTER 7: The Discrete Fourier Transform (DFT) & Properties

### 1. Definition of the DFT
The $N$-point Discrete Fourier Transform converts a finite-duration discrete sequence $x[n]$ of length $N$ into frequency samples:
$$X[k] = \sum_{n=0}^{N-1} x[n] W_N^{kn}, \quad k = 0, 1, \dots, N - 1$$
where $W_N = e^{-j \frac{2\pi}{N}}$ is the **twiddle factor**.

### 2. Inverse DFT (IDFT)
$$x[n] = \frac{1}{N} \sum_{k=0}^{N-1} X[k] W_N^{-kn}, \quad n = 0, 1, \dots, N - 1$$

### 3. Essential Properties of Twiddle Factors
- Periodicity: $W_N^{k + N} = W_N^k$.
- Symmetry: $W_N^{k + N/2} = -W_N^k$.
- Reduction: $W_N^{2k} = W_{N/2}^k$.

### 4. DFT Properties & Theorems
1. **Linearity:** $\text{DFT}\{a x_1[n] + b x_2[n]\} = a X_1[k] + b X_2[k]$.
2. **Circular Time Shift:** $\text{DFT}\{x[((n - m))_N]\} = W_N^{km} X[k] = X[k] e^{-j \frac{2\pi}{N} km}$.
3. **Circular Frequency Shift:** $\text{DFT}\{x[n] W_N^{-ln}\} = X[((k - l))_N]$.
4. **Circular Convolution Theorem:**
   - Circular convolution of two length-$N$ sequences:
     $$y_c[n] = x_1[n] \circledast x_2[n] = \sum_{m=0}^{N-1} x_1[m] x_2[((n - m))_N]$$
   - Multiplication in DFT domain:
     $$Y_c[k] = X_1[k] \cdot X_2[k]$$
5. **Parseval's Relation:**
   $$\sum_{n=0}^{N-1} |x[n]|^2 = \frac{1}{N} \sum_{k=0}^{N-1} |X[k]|^2$$

### 5. Circular vs Linear Convolution
- Direct circular convolution of length $N$ yields time-domain aliasing (wrap-around) if the underlying linear convolution has length greater than $N$.
- **Zero-Padding Rule for Linear Convolution via DFT:**
  If $x_1[n]$ has length $L_1$ and $x_2[n]$ has length $L_2$, their linear convolution has length:
  $$L = L_1 + L_2 - 1$$
  To compute the exact linear convolution using the DFT/IDFT:
  1. Pad both sequences with zeros to a common length $N \ge L_1 + L_2 - 1$.
  2. Compute $X_1[k] = \text{DFT}_N\{x_1[n]\}$ and $X_2[k] = \text{DFT}_N\{x_2[n]\}$.
  3. Multiply pointwise: $Y[k] = X_1[k] X_2[k]$.
  4. Compute IDFT: $y[n] = \text{IDFT}_N\{Y[k]\}$. The result matches the exact linear convolution.

---

## CHAPTER 8: Fast Fourier Transform (FFT) & Digital Filter Structures

### 1. Computational Complexity & The Need for FFT
- **Direct DFT Computation:**
  - Complex multiplications: $N^2$.
  - Complex additions: $N(N - 1) \approx N^2$.
  - Computational complexity is $\mathcal{O}(N^2)$. For $N = 1024$, $N^2 \approx 10^6$ operations.
- **Radix-2 FFT Algorithms (Cooley-Tukey):**
  - Complex multiplications: $\frac{N}{2} \log_2 N$.
  - Complex additions: $N \log_2 N$.
  - Computational complexity is $\mathcal{O}(N \log_2 N)$. For $N = 1024$, $\frac{N}{2} \log_2 N = 512 \times 10 \approx 5120$ multiplications (over $200\times$ faster!).

### 2. Decimation-in-Time (DIT-FFT)
- Principle: Splits input sequence $x[n]$ of length $N = 2^r$ into two sequences of length $N/2$: even-indexed samples $x[2m]$ and odd-indexed samples $x[2m+1]$.
- Mathematical Formulation:
  $$X[k] = G[k] + W_N^k H[k], \quad k = 0, 1, \dots, \frac{N}{2} - 1$$
  $$X\left[k + \frac{N}{2}\right] = G[k] - W_N^k H[k]$$
- **Butterfly Structure:** The basic computational unit takes two inputs $A$ and $B$, applies twiddle multiplication $B \cdot W_N^k$, and produces $A + B W_N^k$ and $A - B W_N^k$.
- **Input / Output Ordering:** Input is in **Bit-Reversed Order**, while Output is in **Natural Order**.

### 3. Decimation-in-Frequency (DIF-FFT) (Sande-Tukey)
- Principle: Splits output frequency spectrum $X[k]$ into even-indexed coefficients $X[2k]$ and odd-indexed coefficients $X[2k+1]$.
- Input is in **Natural Order**, while Output is in **Bit-Reversed Order**.

### 4. Realization of Digital Filter Structures
Given transfer function:
$$H(z) = \frac{\sum_{m=0}^M b_m z^{-m}}{1 + \sum_{k=1}^N a_k z^{-k}}$$
1. **Direct Form I:**
   - Separately realizes zeros (feedforward part) and poles (feedback part).
   - Requires $M + N$ delay elements (registers / memory units).
2. **Direct Form II (Canonical Form):**
   - Combines and shares common delay elements between poles and zeros.
   - Requires $\max(M, N)$ delay elements (minimal memory requirement).
3. **Cascade Form:**
   - Factoring $H(z)$ into product of second-order biquadratic sections:
     $$H(z) = \prod_{i=1}^K \frac{b_{0i} + b_{1i} z^{-1} + b_{2i} z^{-2}}{1 + a_{1i} z^{-1} + a_{2i} z^{-2}}$$
   - Less sensitive to coefficient quantization errors.
4. **Parallel Form:**
   - Performing partial fraction expansion into sum of first and second-order sections:
     $$H(z) = C + \sum_{i=1}^{K_1} \frac{A_i}{1 - p_i z^{-1}} + \sum_{j=1}^{K_2} \frac{B_{0j} + B_{1j} z^{-1}}{1 + a_{1j} z^{-1} + a_{2j} z^{-2}}$$

---

## FOUNDATIONAL COMPONENT: Continuous Signals & Systems (Signals & Systems)

### 1. Continuous-Time Fourier Series (CTFS)
- For periodic continuous signal $x(t)$ with period $T_0$ and fundamental frequency $\omega_0 = 2\pi / T_0$:
  - Exponential form: $x(t) = \sum_{k=-\infty}^{\infty} a_k e^{j k \omega_0 t}$.
  - Coefficients: $a_k = \frac{1}{T_0} \int_{T_0} x(t) e^{-j k \omega_0 t} dt$.
  - Parseval's Power Theorem: $P_{avg} = \frac{1}{T_0} \int_{T_0} |x(t)|^2 dt = \sum_{k=-\infty}^{\infty} |a_k|^2$.

### 2. Continuous-Time Fourier Transform (CTFT)
- Forward CTFT: $X(\omega) = \int_{-\infty}^{\infty} x(t) e^{-j\omega t} dt$.
- Inverse CTFT: $x(t) = \frac{1}{2\pi} \int_{-\infty}^{\infty} X(\omega) e^{j\omega t} d\omega$.
- Convolution in Time Property: $x_1(t) * x_2(t) \leftrightarrow X_1(\omega) \cdot X_2(\omega)$.
- Modulation in Frequency Property: $x(t) \cos(\omega_0 t) \leftrightarrow \frac{1}{2}[X(\omega - \omega_0) + X(\omega + \omega_0)]$.

### 3. Continuous Laplace Transform & Stability
- Bilateral Laplace Transform: $X(s) = \int_{-\infty}^{\infty} x(t) e^{-st} dt$, where $s = \sigma + j\omega$.
- Transfer Function $H(s) = \frac{Y(s)}{X(s)}$.
- **Stability Condition:** An analog LTI system is BIBO stable if and only if all poles of $H(s)$ lie strictly in the open Left-Half of the s-plane ($\text{Re}(s_i) < 0$).
- **Bode Plots:** Logarithmic plot of frequency response $H(j\omega)$:
  - Magnitude in decibels: $20 \log_{10} |H(j\omega)|$.
  - Phase in degrees: $\angle H(j\omega)$.
  - Gain margin ($GM$) and Phase margin ($PM$) determine stability margins.

---

## MASTER EXAM PROBLEM PATTERNS & SOLVED TEMPLATES

### Problem Type 1: Linearity, Time-Invariance & Stability Verification
- **Example:** Test system $y[n] = x[n] + \frac{1}{2} x[n-1] + 2$ for linearity and time-invariance.
  - *Linearity:* $y[n]$ contains non-zero additive constant $2$. For zero input $x[n]=0$, $y[n] = 2 \ne 0$. Therefore, **Nonlinear**.
  - *Time-Invariance:* Let $x_1[n] = x[n-k] \implies y_1[n] = x[n-k] + \frac{1}{2} x[n-k-1] + 2$. Now shift original output: $y[n-k] = x[n-k] + \frac{1}{2} x[n-k-1] + 2$. Since $y_1[n] \equiv y[n-k]$, the system is **Time-Invariant**.
  - *Stability:* $|y[n]| \le |x[n]| + \frac{1}{2} |x[n-1]| + 2 \le M_x + 0.5 M_x + 2 < \infty$. **Stable**.

### Problem Type 2: Graphical / Analytical Convolution Sum
- **Example:** Find $y[n] = x[n] * h[n]$ where $x[n] = \{1, 2, 3\}$ for $n = 0, 1, 2$ and $h[n] = \{1, 1, 1, 1\}$ for $n = 0, 1, 2, 3$.
  - $L_x = 3$, $L_h = 4 \implies L_y = 3 + 4 - 1 = 6$ points (from $n=0$ to $n=5$).
  - Tabular method:
    - $y[0] = 1 \times 1 = 1$.
    - $y[1] = 1 \times 1 + 2 \times 1 = 3$.
    - $y[2] = 1 \times 1 + 2 \times 1 + 3 \times 1 = 6$.
    - $y[3] = 1 \times 1 + 2 \times 1 + 3 \times 1 = 6$.
    - $y[4] = 2 \times 1 + 3 \times 1 = 5$.
    - $y[5] = 3 \times 1 = 3$.
  - Result: $y[n] = \{1, 3, 6, 6, 5, 3\}$ for $n = 0, 1, 2, 3, 4, 5$.

### Problem Type 3: Z-Transform, ROC & Inverse Z-Transform
- **Example:** System transfer function $H(z) = \frac{1 - z^{-1}}{1 - \frac{5}{6} z^{-1} + \frac{1}{6} z^{-2}}$.
  - Factor denominator: $(1 - \frac{1}{2} z^{-1})(1 - \frac{1}{3} z^{-1}) = 0 \implies$ Poles at $z = \frac{1}{2}, z = \frac{1}{3}$.
  - Zero at $z = 1$.
  - If system is **causal**: $\text{ROC: } |z| > \frac{1}{2}$.
  - Is it **stable**? Since $|z| > \frac{1}{2}$ contains the unit circle $|z|=1$, it is **stable**.
  - Partial fraction expansion:
    $$H(z) = \frac{-3}{1 - \frac{1}{2} z^{-1}} + \frac{4}{1 - \frac{1}{3} z^{-1}}$$
  - Inverse Z-transform (causal):
    $$h[n] = \left[-3 \left(\frac{1}{2}\right)^n + 4 \left(\frac{1}{3}\right)^n\right] u[n]$$

### Problem Type 4: DFT & Linear vs Circular Convolution
- **Example:** Given $x[n] = \{1, 2\}$ and $h[n] = \{3, 4\}$.
  - 2-point circular convolution:
    $$y_c[0] = x[0]h[0] + x[1]h[1] = (1)(3) + (2)(4) = 11$$
    $$y_c[1] = x[0]h[1] + x[1]h[0] = (1)(4) + (2)(3) = 10$$
    $y_c[n] = \{11, 10\}$.
  - Linear convolution: length $L = 2 + 2 - 1 = 3$.
    $y[0] = 3, y[1] = 4 + 6 = 10, y[2] = 8$.
    Notice $y_c[0] = y[0] + y[2] = 3 + 8 = 11$ (aliasing).
  - To get linear convolution via DFT, zero-pad both to length $N \ge 3$ (e.g. $N=4$).
