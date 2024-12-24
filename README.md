# Wave intercae UI
Inspired by https://waaark.com.

Check it out:
- [Interface](https://cavic19.github.io/wave-interface-ui/)
- [Bubbles](https://cavic19.github.io/wave-interface-ui/)

## Solution
On the first thought I thought I would need to solve a wave equation with Dirichlet boundary condition, which takes into account how the neighbouring elements affect each other. But after diescting the page code, I found out that the implementation can indeed be quite simple. 

The interface is formed from a few discrete damped harmonic oscilator, which are isolated from its neighbours, and the illusion of the wave is created using Bezier curve. 

### Damped harmonic oscillator
Discrete derivative with time step $dt$ can be calculated as follows:

``` math
\begin{aligned}
v_t = \frac{x_{t+1} - x_t}{dt}, \\
\dot{v}_t =  \frac{v_{t+1} - v_t}{dt}.
\end{aligned}
```

Equation of motion for damped harmonic oscilator with damping coefficient $\delta$ is:

``` math
\dot{v}_t + 2\delta v_t + \omega_0^2x_t = 0.
```

From the equations above we deduce the next amplitude $x_{t+1}$, and the next velocity $v_{t+1}$:

``` math
\begin{aligned}
x_{t+1} = x_t + v_tdt, \\
v_{t+1} = (1 - 2\delta dt)v_t - \omega_0^2dtx_t.
\end{aligned}
```

So we have 2 coefficients we have 2 set. $\delta$ is resposnible for damping the oscilations, and $\omega_0$ indirectly is responsible for the frequency of the oscilation. We can directly set the freqency $f$ and derive $\omega_0$ from it by following:

``` math
\begin{aligned}
\omega^2 = \omega_0^2 - \delta^2 \\
\omega = 2\pi f \\
\omega_0^2 = \delta^2 + 4\pi^2 f^2
\end{aligned}
```

When fine tuning the coefficients make sure that $\delta^2 < \omega_0^2$ is met, otherwise the damping is too big, and it wil kill all the oscilations.

We also need to set initial amplitudes and velocities of all the points. The positions will always be zeros and velocities will be determiend by the mouse movement!

### Bezier curves
The effect of the continous wave is formed by employing the Bezier curves. Where the control points are the actual points, and points we are connecting are made up ones between the actual points (TODO: Explaion better)..
![image](https://github.com/user-attachments/assets/4126645c-8c8b-4b17-9bd0-b39f31410790)
