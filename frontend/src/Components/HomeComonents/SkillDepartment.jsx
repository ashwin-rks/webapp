import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import Select from "react-select";

const SkillDepartment = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [skills, setSkills] = useState([]); 
  const [selectedSkills, setSelectedSkills] = useState([]); 

  const allOption = { value: "*", label: "All Skills" };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8000/data/get-skills-department",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data.filter(
          (dept) => dept.departmentName !== "Manager" 
        );
        setData(responseData);

        const skillSet = new Set();
        responseData.forEach((dept) => {
          dept.skills.forEach((skill) => {
            skillSet.add(skill.skillName);
          });
        });

        const skillOptions = Array.from(skillSet).map((skill) => ({
          value: skill,
          label: skill,
        }));

        setSkills([allOption, ...skillOptions]);

        // Set the top 15 skills as default selected skills
        const topSkills = skillOptions.slice(0, 15);
        setSelectedSkills([allOption, ...topSkills]);

        generateChartData(responseData, topSkills.map((option) => option.value));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateChartData = (data, selectedSkillNames) => {
    const filteredData = [];

    data.forEach((dept) => {
      const departmentLabel = dept.departmentName;
      const departmentSkills = dept.skills.filter((skill) =>
        selectedSkillNames.includes(skill.skillName)
      );

      if (departmentSkills.length > 0) {
        filteredData.push({ departmentLabel, departmentSkills });
      }
    });

    const output = {
      labels: selectedSkillNames, 
      datasets: [],
    };

    filteredData.forEach((dept) => {
      const departmentData = Array(output.labels.length).fill(0);

      dept.departmentSkills.forEach((skill) => {
        const index = output.labels.indexOf(skill.skillName);
        if (index !== -1) {
          departmentData[index] = skill.usersWithSkill;
        }
      });

      output.datasets.push({
        type: "bar",
        label: dept.departmentLabel,
        data: departmentData,
      });
    });

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };

    setChartData(output);
    setChartOptions(options);
  };

  const handleSkillChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === allOption.value)) {
      setSelectedSkills([allOption, ...skills.slice(1)]); 
      generateChartData(data, skills.slice(1).map((skill) => skill.value)); 
    } else {
      setSelectedSkills(selectedOptions);
      const selectedSkillNames = selectedOptions.map((option) => option.value);
      generateChartData(data, selectedSkillNames);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: "#5949f4" }}>
        Users by Skill
      </h2>

      <Select
        isMulti
        options={skills}
        value={selectedSkills}
        onChange={handleSkillChange}
        className="mb-4"
        placeholder="Select Skill(s)"
        closeMenuOnSelect={false}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#5949f4",
            primary25: "#e6e6fa",
          },
        })}
      />

      {chartData ? (
        <Chart type="bar" data={chartData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default SkillDepartment;
