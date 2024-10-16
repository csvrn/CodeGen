const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3001;

const {
  getFields,
  createField,
  updateField,
  deleteField,
} = require("./fieldApi");

const {
  getScreens,
  getScreensWithMenu,
  createScreen,
  updateScreen,
  deleteScreen,
  getColLayout,
} = require("./screenApi");

const {
  getMenus,
  getMenusWithName,
  getFlatMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("./menuApi");

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("./projectApi");

app.use(express.json());
app.use(cors());

const directory_path = process.env.NEW_DIR;

//#region projects
app.get("/getProjects", async (req, res) => {
  try {
    const projects = await getProjects();
    res.json(projects);
    console.log("Projects loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading projects");
  }
});

app.post("/createProject", async (req, res) => {
  const { data } = req.body;
  try {
    const newProject = await createProject(data);
    res.json(newProject);
    console.log("Project created successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating project");
  }
});
app.post("/updateProject", async (req, res) => {
  const { data } = req.body;
  try {
    const updatedProject = await updateProject(data);
    res.json(updatedProject);
    console.log("Project updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating project");
  }
});
app.post("/deleteProject", async (req, res) => {
  const { data } = req.body;
  try {
    const result = await deleteProject(data);
    res.json(result);
    console.log("Project deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting project");
  }
});
//#endregion

//#region menus
app.get("/getMenus", async (req, res) => {
  try {
    const menus = await getMenus();
    res.json(menus);
    console.log("Menus loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading menus");
  }
});
app.get("/getMenusWithName", async (req, res) => {
  try {
    const menus = await getMenusWithName();
    res.json(menus);
    console.log("Menus loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading menus");
  }
});

app.get("/getFlatMenus", async (req, res) => {
  try {
    const menus = await getFlatMenus();
    res.json(menus);
    console.log("Menus loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading menus");
  }
});
app.post("/createMenu", async (req, res) => {
  const { data } = req.body;
  try {
    const newMenu = await createMenu(data);
    res.json(newMenu);
    console.log("Menu created successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating menu");
  }
});
app.post("/updateMenu", async (req, res) => {
  const { data } = req.body;
  try {
    const updatedMenu = await updateMenu(data);
    res.json(updatedMenu);
    console.log("Menu updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating menu");
  }
});
app.post("/deleteMenu", async (req, res) => {
  const { data } = req.body;
  try {
    const result = await deleteMenu(data);
    res.json(result);
    console.log("Menu deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting menu");
  }
});
//#endregion

//#region screens
app.get("/getScreens", async (req, res) => {
  try {
    const screens = await getScreens();
    res.json(screens);
    console.log("Screens loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading screens");
  }
});
app.get("/getScreensWithMenu", async (req, res) => {
  try {
    const screens = await getScreensWithMenu();
    res.json(screens);
    console.log("Screens loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading screens");
  }
});
app.get("/getScreenById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const screen = await getScreens(id);
    res.json(screen);
    console.log("Screen loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading screen");
  }
});

app.post("/createScreen", async (req, res) => {
  const { data } = req.body;
  try {
    const newScreen = await createScreen(data);
    res.json(newScreen);
    console.log("Screen created successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating screen");
  }
});
app.post("/updateScreen", async (req, res) => {
  const { data } = req.body;
  try {
    const updatedScreen = await updateScreen(data);
    res.json(updatedScreen);
    console.log("Screen updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating screen");
  }
});
app.post("/deleteScreen", async (req, res) => {
  const { data } = req.body;
  try {
    const result = await deleteScreen(data);
    res.json(result);
    console.log("Screen deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting screen");
  }
});
app.get("/getColLayout", async (req, res) => {
  try {
    const colLays = await getColLayout();
    res.json(colLays);
    console.log("Screens loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading screens");
  }
});

//#endregion screens

//#region fields
app.get("/getFields/:screenName", async (req, res) => {
  try {
    const fields = await getFields(req.params.screenName);
    res.json(fields);
    console.log("Fields loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading fields");
  }
});

app.post("/createField", async (req, res) => {
  const { data } = req.body;
  try {
    const newField = await createField(data);
    res.json(newField);
    console.log("Field created successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating field");
  }
});
app.post("/updateField", async (req, res) => {
  const { data } = req.body;
  try {
    const updatedScreen = await updateField(data);
    res.json(updatedScreen);
    console.log("Field updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating field");
  }
});
app.post("/deleteField", async (req, res) => {
  const { data } = req.body;
  try {
    const result = await deleteField(data);
    res.json(result);
    console.log("Field deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting field");
  }
});
//#endregion fields

//#region creator

function writeToFile(directory_path, element, res) {
  fs.writeFile(
    `${path.join(directory_path, "/routes")}/${element[0]}`,
    element[1],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing to file");
        return;
      }
    }
  );
}

app.post("/writeFile", (req, res) => {
  const { data, menuName } = req.body;
  const dir = path.join(directory_path, "/routes", menuName);

  const writeOperations = [
    { subDir: path.join(dir, ""), element: data[0] },
    { subDir: path.join(dir, "list"), element: data[1] },
    { subDir: path.join(dir, "list"), element: data[2] },
    { subDir: path.join(dir, "list"), element: data[3] },
    { subDir: path.join(dir, "list/components"), element: data[4] },

    { subDir: path.join(dir, "detail"), element: data[5] },
    { subDir: path.join(dir, "detail"), element: data[6] },
    { subDir: path.join(dir, "detail"), element: data[7] },
    { subDir: path.join(dir, "detail/components"), element: data[8] },

    { subDir: path.join(dir, "hooks"), element: data[9] },
    { subDir: path.join(dir, "hooks"), element: data[10] },
    { subDir: path.join(dir, "hooks"), element: data[11] },
    { subDir: path.join(dir, "hooks"), element: data[12] },

    {
      subDir: path.join(directory_path, "components/Controls", menuName),
      element: data[13],
    },
    {
      subDir: path.join(
        directory_path,
        "components/Controls",
        menuName,
        "hooks"
      ),
      element: data[14],
    },

    {
      subDir: path.join(directory_path, "components/Controls", menuName),
      element: data[15],
    },
    {
      subDir: path.join(directory_path, "components/Layout"),
      element: data[17],
    },
  ];

  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error creating base directory");
    }

    Promise.all(
      writeOperations.map((operation) => {
        const fullDir = operation.subDir;
        return new Promise((resolve, reject) => {
          fs.mkdir(fullDir, { recursive: true }, (err) => {
            if (err) {
              return reject(err.message);
            }

            fs.writeFile(
              path.join(fullDir, operation.element[0]),
              operation.element[1],
              (err) => {
                if (err) {
                  return reject(err.message);
                }
                resolve();
              }
            );
          });
        });
      })
    )
      .then(() => {
        console.log("All files written successfully");
        res.status(200).send("Files written successfully");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error writing to file");
      });
  });
});

app.get("/creator/getFields/:screenName", async (req, res) => {
  try {
    const fields = await getFields(req.params.screenName);
    res.json(fields.rows);
    console.log("Fields loaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading fields");
  }
});

app.get("/readFile", (req, res) => {
  const { data } = req.body;

  fs.readFile(`${directory_path}/index.d.ts`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
  console.log("File written successfully");
});

//#endregion creator

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
