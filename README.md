<img src = "https://i.postimg.cc/TP8vsSVt/logo.png" width = 128 height = 128 align = "left">
<div id = "toc">
  <ul>
    <summary>
      <h1>Constele Red</h1><br>A multi-threaded, asynchronous directed acyclic spatiotemporal processing suite.
    </summary>
  </ul>
</div>
<br>
<img src = "https://i.postimg.cc/3ND2B1zL/crd-coat-of-arms-logo.png" height = "64">


[![Join our community!](https://img.shields.io/discord/548994743925997570?label=Discord&style=for-the-badge)](https://discord.gg/89kQY2KFQz) ![](https://img.shields.io/github/languages/code-size/Confoederatio/AnalyticalEngine?style=for-the-badge) <!--![](https://img.shields.io/github/downloads/Confoederatio/AnalyticalEngine/total?style=for-the-badge)-->

## Abstract.

> [!NOTE]
> Tilemap APIs may occasionally be overloaded. When this occurs, consider providing your own API keys, or switching to a more reliable provider from the **Base Map Layer** menu, such as <ins>Carto</ins> or <ins>OSM</ins>.

**Constele Red** is a stopgap grid-based mapping suite built for historical statistics and heavy duty data processing/cleaning. It works by hooking into an existing CLI/Node.js application and specifying tasks/function calls in a directed acyclic graph (DAG), which is mounted on separate child processes. This allows the render thread to command tasks to workers as well as to render any custom end visualisations from the geoprocessing chain. It will then sequentially execute dependencies, updating them in real-time.

<br>
<table>
  <tr>
    <td>
      <img src = "https://i.postimg.cc/YSNZsSqS/constele-red-preview-02.png">
      <div align = "center">(Node-based Dataflows)</div>
    </td>
    <td>
      <img src = "https://i.postimg.cc/xC0hDSc3/constele-red-preview-01.png">
      <div align = "center">(3D Map Editor)</div>
    </td>
  </tr>
</table>
<br>

This application is mainly split into a node-based dataflow editor and a map visualiser, where multiple mapmodes may be saved and switched between. Mapmodes are scriptable, as are individual function/command calls from within nodes. **Constele Red** is built as a supplement to [Naissance GIS](https://github.com/Confoederatio/Naissance), a 3D HGIS used by <ins>Confoederatio</ins>. Statistical integration and data visualisation suites have also been added on via D3.js compatibility.

## Dependencies.
- BaklavaJS (Browser-build, no Vue)
- [Geospatiale II](https://confoederatiodocs.info/en/CTD/Universal_Framework/Geospatiale/Geospatiale_II) (internal geospatial processing framework)
- Maptalks
- [Universal Framework](https://github.com/Confoederatio/UniversalFramework) (internal QOL framework)
- [Vercengen](https://github.com/Confoederatio/Vercengen/) (internal frontend framework)

## Save Folders.
- `./mapmodes/` - Contains all mapmodes created in the 3D Map Editor.
- `./scripts/` - Contains all script files used in the Node Editor.
- `database_*.js` - Stores Node state and restores their settings.
