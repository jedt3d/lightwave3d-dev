# Course outline — LScript-first revision
80 hours / 16 modules (proposed). Learn graphics mathematics through small tools, then analyze actual LightWave scripts. Python 3 migration follows, C SDK deferred.

| # | Module | Workshop / case |
|---|---|---|
| 01 | Architecture & LScript Runtime | Hello Modeler / compatibility report |
| 02 | 3D Space & Mesh Data | Point and polygon inspector |
| 03 | Vector Mathematics | Distance / Angle / SelPoints |
| 04 | Requester UI & Interface Designer | Distance Inspector |
| 05 | Transformations & Matrices | Custom Pivot |
| 06 | Computational Geometry | Planar2 study |
| 07 | Procedural Geometry Generation | Circle Points / Honeycomb |
| 08 | Modeling Commands & Macro Automation | Linear / Radial Array |
| 09 | Mesh Topology & Data Structures | Weld Pairs / Mesh Doctor |
| 10 | Curves, Splines & Surfaces | Smooth Spline |
| 11 | UV, Normals & Vertex Maps | Planar projection |
| 12 | Deformation & Spatial Algorithms | Falloff |
| 13 | Scene Graph, Camera & Rendering | Layout utilities |
| 14 | Animation Mathematics & Envelopes | Animation offset |
| 15 | Procedural Geometry & Motion Graphics | Mini Cloner, baked first |
| 16 | Plugin Engineering & Python Migration | Compare LScript / Python |

All 16 modules include learning objectives, a worked example, a workshop, and references. The 80-hour estimate remains a proposed teaching schedule. Worked results are independent of host acceptance tests.

Method: read free resource → predict outcome → run a minimal example → inspect third-party source → explain algorithm → modify one behavior → test and document.

## LScript Course Reviews

Six short courses built from source and SDK documentation found in the macOS
LightWave 3D 2024.1.0 installation. The bundled script directory contains 193
readable `.ls` files, including 68 in Modeler. Relative paths and line ranges in
the lessons identify the installed files for code reading.

| Course | Practice |
|---|---|
| [Modeler](./index.html#review-modeler) | Primitives, Point IDs, Selection Modes, Bounding Box, and Radial Array |
| [LScript UI & Action Events](./index.html#review-ui) | Requester lifecycle, Control Callbacks, Preview, Apply, Cancel, and Undo design |
| [Layout](./index.html#review-layout) | Scene Items, hierarchy traversal, and selection |
| [Animation](./index.html#review-animation) | Channel Object Agents, frame-grid arithmetic, and keyframe moves |
| [Materials](./index.html#review-materials) | Surface names, polygon assignment, and dry-run planning |
| [Nodes](./index.html#review-nodes) | Shading data flow, Port Types, and reading the installed C SDK documentation |

The UI course includes a browser simulation and an original
[Requester Events LScript](./examples/requester_events.ls). Runtime exercises
include expected outcomes and still need execution in Modeler or Layout.
