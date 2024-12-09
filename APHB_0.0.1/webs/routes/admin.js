/*                       admin.js -- routes /admin/*                      */

var express = require("express");
var router = express.Router();
var dataModel = require("../models/data-model.js");

/* ROUTE: /admin                                                          */

/* Function to render page                  */

function renderPage(req, res) {
  if (req.user.username == "Admin") {
    res.render("admin", {
      pagetitle: "Control Panel",
    });

    // The user was not Jebsan,
  } else {
    res.redirect("/auth/signIn");
  }
}

router.get("/", renderPage);

/* ROUTE: /admin/announce                                                 */

router.get("/announce", function (req, res, next) {
  dataModel.readTable("announce", function (data) {
    res.render("admin-announce", {
      pagetitle: "Edit Announcements",
      announcements: data,
    });
  });
});

/* ROUTE: /admin/update/announce                                          */

router.post("/update/announce", function (req, res, next) {
  cb = function () {
    /* same callback used for update and delete */
    res.redirect("/admin/announce");
  };
  if (req.body.action == "delete") {
    /* if action = delete */
    dataModel.deleteRow("announce", req.body.id, cb);
  } else {
    /* else action = update */
    dataModel.updateRow("announce", req.body, cb);
  }
});

/* ROUTE: /admin/create/announce                                          */

router.post("/create/announce", function (req, res, next) {
  dataModel.createRow("announce", function () {
    res.redirect("/admin/announce#footer");
  });
});

/* ROUTE: /admin/items                                                    */

router.get("/items", function (req, res, next) {
  dataModel.readTable("items", function (data) {
    Object.keys(data).forEach(function (id) {
      data[id].price = (parseFloat(data[id].price) / 100).toFixed(2);
    });
    res.render("admin-items", { pagetitle: "Edit Items", items: data });
  });
});

/* ROUTE: /admin/update/item                                              */

router.post("/update/item", function (req, res, next) {
  cb = function () {
    res.redirect("/admin/items");
  };
  if (req.body.action == "delete") {
    dataModel.deleteRow("items", req.body.id, cb);
  } else {
    /* req.body.price is e.g., 5.00 */
    /* Convert to e.g., 500 for database storage */
    /* if user input is more precise than a penny e.g., 5.005 */
    /* then use Math.floor to discard that data */
    req.body.price = Math.floor(parseFloat(req.body.price) * 100);
    dataModel.updateRow("items", req.body, cb);
  }
});

/* ROUTE: /admin/create/item                                              */

router.post("/create/item", function (req, res, next) {
  dataModel.createRow("items", function () {
    res.redirect("/admin/items#footer");
  });
});

/* ROUTE: /admin/events                                                   */

router.get("/events", function (req, res, next) {
  dataModel.readTable("events", function (data) {
    res.render("admin-events", {
      pagetitle: "Edit Events",
      events: data,
    });
  });
});

/* ROUTE: /admin/update/event                                             */

router.post("/update/event", function (req, res, next) {
  let cb = function () {
    res.redirect("/admin/events");
  };
  if (req.body.action == "delete") {
    dataModel.deleteRow("events", req.body.id, cb);
  } else {
    dataModel.updateRow("events", req.body, cb);
  }
});

/* ROUTE: /admin/create/event                                             */

router.post("/create/event", function (req, res, next) {
  dataModel.createRow("events", function () {
    res.redirect("/admin/events#footer");
  });
});

/* ROUTE: /admin/motd                                                     */

router.get("/motd", function (req, res, next) {
  dataModel.readTable("motd", function (data) {
    res.render("admin-motd", {
      pagetitle: "Edit MOTD",
      motd: data,
    });
  });
});

/* ROUTE: /admin/update/motd                                              */

router.post("/update/motd", function (req, res, next) {
  cb = function () {
    res.redirect("/admin/motd");
  };
  if (req.body.action == "delete") {
    dataModel.deleteRow("motd", req.body.id, cb);
  } else {
    dataModel.updateRow("motd", req.body, cb);
  }
});

/*  ROUTE: /admin/create/motd                                             */

router.post("/create/motd", function (req, res, next) {
  dataModel.createRow("motd", function () {
    res.redirect("/admin/motd");
  });
});

module.exports = router;
