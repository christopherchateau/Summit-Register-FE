import React from "react";
import App from "..";
import { shallow } from "enzyme";

jest.mock("../../utilities/helper/apiCalls");

describe("App", () => {
  let wrapper;
  const currentMountainData = {
    id: "61",
    type: "mountain",
    attributes: {
      altitude: 5207,
      difficulty: "Green",
      name: "Dry Peak",
      range: "Front",
      registries: {},
      summit: "39.753114,-104.994165"
    }
  };
  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it("should match snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("", () => {
    expect(wrapper.state().withinRange).toBe(false);
  });

  it("", () => {
    expect(wrapper.state().isSignedIn).toBe(false);
  });

  describe("handleBackButton", () => {
    let currentDisplay;
    beforeEach(() => {
      currentDisplay = [
        "log",
        "loadingScreen",
        "registerForm",
        "log",
        "info",
        "start"
      ];
      wrapper.state().currentDisplay = currentDisplay;
    });

    it("should remove loadingScreen from browsing history", () => {
      wrapper.instance().handleBackButton();
      const { currentDisplay } = wrapper.state();
      expect(currentDisplay.includes("loadingScreen")).toBe(false);
    });

    it("should remove registerForm from browsing history", () => {
      wrapper.instance().handleBackButton();
      const { currentDisplay } = wrapper.state();
      expect(currentDisplay.includes("registerForm")).toBe(false);
    });

    it("should remove never go back to current screen", () => {
      wrapper.instance().handleBackButton();
      const { currentDisplay } = wrapper.state();
      expect(currentDisplay[0]).not.toEqual("log");
    });

    it("should update state accordingly", () => {
      wrapper.instance().handleBackButton();
      const { currentDisplay } = wrapper.state();
      const expected = ["info", "start"];
      expect(currentDisplay).toEqual(expected);
    });
  });

  describe("handleViewLogButton", () => {
    it("should add all log entries to currentMountainLog", async () => {
      await wrapper.instance().handleViewLogButton();

      const { currentMountainLog } = wrapper.state();
      const names = currentMountainLog.map(log => log.attributes.name);
      const hometowns = currentMountainLog.map(log => log.attributes.hometown);

      expect(currentMountainLog).toHaveLength(2);
      expect(names.includes("Chris")).toBe(true);
      expect(names.includes("Justin")).toBe(true);
      expect(hometowns.includes("Detroit")).toBe(true);
      expect(hometowns.includes("Denver")).toBe(true);
    });

    it("should add 'log' to currentDisplay array", async () => {
      await wrapper.instance().handleViewLogButton();

      const { currentDisplay } = wrapper.state();
      expect(currentDisplay[0]).toEqual("log");
    });
  });

  describe("handleSelectButton", () => {
    it("should update state with selected mountain data", async () => {
      await wrapper.instance().handleSelectButton("Blanca Peak");

      const {
        altitude,
        difficulty,
        summit,
        range,
        name,
        registries
      } = wrapper.state().currentMountainData.attributes;

      expect(name).toEqual("Blanca Peak");
      expect(altitude).toEqual(14345);
      expect(difficulty).toEqual("Black");
      expect(summit).toEqual("37.577473,-105.485443");
      expect(range).toEqual("Sangre de Cristo");
      expect(registries.data).toHaveLength(2);
    });

    it("should add 'info' to currentDisplay array", async () => {
      await wrapper.instance().handleSelectButton("Blanca Peak");

      const { currentDisplay, currentMountain } = wrapper.state();
      expect(currentDisplay[0]).toEqual("info");
    });
  });

  describe("handleSignLog", () => {
    let userLocation;

    beforeEach(() => {
      userLocation = {
        latitude: 39.753114,
        longitude: -104.994165
      };
      wrapper.state().currentMountainData = currentMountainData;
    });

    it("should add 'registerForm' to currentDisplay array", () => {
      wrapper.state().currentLocation = userLocation;
      wrapper.instance().validateLocation(userLocation);

      wrapper.instance().handleSignLog();
      expect(wrapper.state().currentDisplay[0]).toEqual("registerForm");
    });

    it("should not add 'registerForm' if location not validated", () => {
      userLocation = {
        latitude: 999,
        longitude: -999
      };
      wrapper.state().currentLocation = userLocation;
      wrapper.instance().validateLocation(userLocation);
      wrapper.instance().handleSignLog();
      expect(wrapper.state().currentDisplay[0]).toEqual("start");
    });
  });

  describe("handleSignIn", () => {
    it("should add 'signIn' to currentDisplay array", () => {
      wrapper.instance().handleSignIn();

      const { currentDisplay } = wrapper.state();
      expect(currentDisplay[0]).toEqual("signIn");
    });
  });

  describe("updateCurrentDisplayLog", () => {
    it("should add input to currentDisplay array in state", () => {
      wrapper.instance().updateCurrentDisplayLog("hello");
      expect(wrapper.state().currentDisplay[0]).toEqual("hello");

      wrapper.instance().updateCurrentDisplayLog("hello... again");
      expect(wrapper.state().currentDisplay[0]).toEqual("hello... again");
      expect(wrapper.state().currentDisplay[1]).toEqual("hello");
      expect(wrapper.state().currentDisplay[2]).toEqual("start");
    });
  });

  describe("getWeatherData", () => {
    it("should load weather data to state", async () => {
      const summary = "Mostly cloudy throughout the day.";
      const icon = "partly-cloudy-night";

      wrapper.state().currentMountainData = currentMountainData;
      await wrapper.instance().getWeatherData();

      expect(wrapper.state().currentMountainWeather.summary).toEqual(summary);
      expect(wrapper.state().currentMountainWeather.icon).toEqual(icon);
      expect(wrapper.state().currentMountainWeather.data).toHaveLength(3);
    });
  });

  describe("handleLogUpdate", () => {
    it("should update currentMountainLog in state with response", async () => {
      await wrapper.instance().handleLogUpdate();

      const { currentMountainLog } = wrapper.state();
      const names = currentMountainLog.map(log => log.attributes.name);
      const hometowns = currentMountainLog.map(log => log.attributes.hometown);

      expect(currentMountainLog).toHaveLength(2);
      expect(names.includes("Andrew M")).toBe(true);
      expect(names.includes("Andrew T")).toBe(true);
      expect(hometowns.includes("Longmont")).toBe(true);
      expect(hometowns.includes("Highlands Ranch")).toBe(true);
    });

    it("should add 'loadingScreen' to currentDisplay array", () => {
      wrapper.instance().handleLogUpdate();

      const { currentDisplay } = wrapper.state();
      expect(currentDisplay[0]).toEqual("loadingScreen");
    });

    it("should add 'log' to currentDisplay array after awaiting response", async () => {
      await wrapper.instance().handleLogUpdate();

      const { currentDisplay } = wrapper.state();
      expect(currentDisplay[0]).toEqual("log");
    });
  });

  describe("validateLocation", () => {
    it("should update state when user location validated", () => {
      const userLocation = {
        latitude: 39.753114,
        longitude: -104.994165
      };
      wrapper.state().currentMountainData = currentMountainData;
      expect(wrapper.state().withinRange).toBe(false);

      wrapper.instance().validateLocation(userLocation);
      expect(wrapper.state().withinRange).toBe(true);
    });
  });

  describe("checkProximity", () => {
    it("should return true for valid nums", () => {
      const result = wrapper.instance().checkProximity(0.002);
      expect(result).toBe(true);
    });

    it("should return true for valid nums", () => {
      const result = wrapper.instance().checkProximity(0.02);
      expect(result).toBe(false);
    });
  });

  describe("validateSignIn", () => {
    it("should update isSignedIn in state accordingly", () => {
      expect(wrapper.state().isSignedIn).toEqual(false);
      wrapper.instance().validateSignIn(true);
      expect(wrapper.state().isSignedIn).toEqual(true);
    });

    it("should add 'start' to currentDisplay array", () => {
      wrapper.instance().validateSignIn(true);

      const { currentDisplay } = wrapper.state();
      expect(currentDisplay[0]).toEqual("start");
    });
  });

  describe("showLocation", () => {
    it("should update currentLocation in state", () => {
      const position = {
        coords: {
          latitude: 40.55555555,
          longitude: -105.9999999
        }
      };
      wrapper.instance().showPosition(position);

      const { longitude, latitude } = wrapper.state().currentLocation;
      expect(longitude).toEqual(-105.9999999);
      expect(latitude).toEqual(40.55555555);
    });
  });

  describe("checkUser", () => {
    it("", () => {
      jest.fn();
    });
  });

  describe("page conditionally rendered based on currentDisplay", () => {
    it("should display Start screen", () => {
      expect(wrapper.find("Start")).toHaveLength(1);
      expect(wrapper.find("Info")).toHaveLength(0);
      expect(wrapper.find("Log")).toHaveLength(0);
      expect(wrapper.find("RegisterForm")).toHaveLength(0);
      expect(wrapper.find("LoadingScreen")).toHaveLength(0);
      expect(wrapper.find("SignIn")).toHaveLength(0);
    });

    it("should display Start screen", () => {
      wrapper.instance().updateCurrentDisplayLog("info");
      expect(wrapper.find("Start")).toHaveLength(0);
      expect(wrapper.find("Info")).toHaveLength(1);
      expect(wrapper.find("Log")).toHaveLength(0);
      expect(wrapper.find("RegisterForm")).toHaveLength(0);
      expect(wrapper.find("LoadingScreen")).toHaveLength(0);
      expect(wrapper.find("SignIn")).toHaveLength(0);
    });

    it("should display Start screen", () => {
      wrapper.instance().updateCurrentDisplayLog("log");
      expect(wrapper.find("Start")).toHaveLength(0);
      expect(wrapper.find("Info")).toHaveLength(0);
      expect(wrapper.find("Log")).toHaveLength(1);
      expect(wrapper.find("RegisterForm")).toHaveLength(0);
      expect(wrapper.find("LoadingScreen")).toHaveLength(0);
      expect(wrapper.find("SignIn")).toHaveLength(0);
    });

    it("should display Start screen", () => {
      wrapper.instance().updateCurrentDisplayLog("registerForm");
      expect(wrapper.find("Start")).toHaveLength(0);
      expect(wrapper.find("Info")).toHaveLength(0);
      expect(wrapper.find("Log")).toHaveLength(0);
      expect(wrapper.find("RegisterForm")).toHaveLength(1);
      expect(wrapper.find("LoadingScreen")).toHaveLength(0);
      expect(wrapper.find("SignIn")).toHaveLength(0);
    });

    it("should display Start screen", () => {
      wrapper.instance().updateCurrentDisplayLog("loadingScreen");
      expect(wrapper.find("Start")).toHaveLength(0);
      expect(wrapper.find("Info")).toHaveLength(0);
      expect(wrapper.find("Log")).toHaveLength(0);
      expect(wrapper.find("RegisterForm")).toHaveLength(0);
      expect(wrapper.find("LoadingScreen")).toHaveLength(1);
      expect(wrapper.find("SignIn")).toHaveLength(0);
    });

    it("should display Start screen", () => {
      wrapper.instance().updateCurrentDisplayLog("signIn");
      expect(wrapper.find("Start")).toHaveLength(0);
      expect(wrapper.find("Info")).toHaveLength(0);
      expect(wrapper.find("Log")).toHaveLength(0);
      expect(wrapper.find("RegisterForm")).toHaveLength(0);
      expect(wrapper.find("LoadingScreen")).toHaveLength(0);
      expect(wrapper.find("SignIn")).toHaveLength(1);
    });
  });
});
