import Card from "antd/es/card/Card";
import React, { useContext, useRef, useState } from "react";

import {
  PlusCircleTwoTone,
  MinusCircleTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";

import { AppConfig } from "../../context/AppConfig";

import Popconfirm from "antd/es/popconfirm";
import Tooltip from "antd/es/tooltip";
import Statistic from "antd/es/statistic";
import InputNumber from "antd/es/input-number";
import Modal from "antd/es/modal/Modal";
import useMessage from "antd/es/message/useMessage";

export const LeaderboardCard = (props) => {
  const [messageApi, contextHolder] = useMessage();

  const [removeloading, setremoveloading] = useState(false);
  const [addingPointLoad, setAddingPointLoad] = useState(false);
  const [removePointloading, setremovePointloading] = useState(false);
  const { removeMember, adminStatus, addPoints, minusPoints } =
    useContext(AppConfig);
  const [removetoggel, setremovetoggle] = useState(false);
  const [addptToggle, setAddPtToggle] = useState(false);

  const [minPtToggle, setMinPtToggle] = useState(false);
  const [addPt, setaddpt] = useState(0);
  const [minPt, setMinPt] = useState(0);

  const actions = [
    <Popconfirm
      placement="top"
      title="Are you sure you want to remove ?"
      onConfirm={commitRemoval}
      onCancel={toggleRemove}
      okText="Yes"
      cancelText="Cancel"
      okButtonProps={{ className: "text-black" }}
      cancelButtonProps={{ danger: true }}
    >
      <Tooltip placement="bottom" title="Delete">
        <DeleteTwoTone onClick={toggleRemove} key="Delete" />
      </Tooltip>
    </Popconfirm>,
    <Tooltip placement="bottom" title="Reduce points">
      <MinusCircleTwoTone onClick={toggleMinPt} key="Reduce points" />
    </Tooltip>,
    <Tooltip placement="bottom" title="Add points">
      <PlusCircleTwoTone onClick={toggleAddPt} key="Add points" />
    </Tooltip>,
  ];

  function toggleMinPt() {
    setMinPtToggle(!minPtToggle);
    setremovetoggle(false);
    setAddPtToggle(false);
  }

  function toggleAddPt() {
    setMinPtToggle(false);
    setAddPtToggle(!addptToggle);
    setremovetoggle(false);
  }

  function toggleRemove() {
    setMinPtToggle(false);
    setremovetoggle(!removetoggel);
    setAddPtToggle(false);
  }

  async function commitAddPt() {
    setAddingPointLoad(true);
    if (addPt > 0) {
      await addPoints(props.regno, props.points, addPt);
      setAddPtToggle(false);
    } else {
      messageApi.open({
        type: "error",
        content: "Enter a number greater than 0!",
      });
    }

    setAddingPointLoad(false);
  }

  async function commitMinPt() {
    setremovePointloading(true);

    console.log({ points: props.points - addPt });

    if (props.points - addPt < 0) {
      messageApi.open({
        type: "warning",
        content: `Enter a number greater than 0 and less than ${props.points}`,
      });

      return;
    }

    if (minPt > 0) {
      await minusPoints(props.regno, props.points, minPt);
      setMinPtToggle(false);
    } else {
      messageApi.open({
        type: "error",
        content: "Enter a number greater than 0!",
      });
    }

    setremovePointloading(false);
  }

  async function commitRemoval() {
    setremoveloading(true);

    await removeMember(props.regno);
    setremovetoggle(false);
    setremoveloading(false);
  }

  const isAddPointsOpen = adminStatus && addptToggle && !addingPointLoad;
  const isReducePointsOpen = adminStatus && minPtToggle && !removePointloading;

  return (
    <>
      <Card
        className="flex flex-col"
        cover={
          <img
            className="h-60 object-fill"
            alt="example"
            src="https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg"
          />
        }
        actions={actions}
      >
        <div className="grid">
          <h1 className="text-3xl font-bold"> {props.name} </h1>
          <h2 className="text-xl font-medium uppercase"> {props.regno} </h2>
        </div>

        <div className="mt-5 w-full flex text-right justify-end">
          <Statistic className="text-xs" value={props.points} suffix="Points" />
        </div>
      </Card>

      <Modal
        title={isAddPointsOpen ? "Add Points" : "Reduce Points"}
        centered
        closable={false}
        open={isAddPointsOpen || isReducePointsOpen}
        onCancel={isAddPointsOpen ? toggleAddPt : toggleMinPt}
        onOk={isAddPointsOpen ? commitAddPt : commitMinPt}
        okText={isAddPointsOpen ? "Add" : "Reduce"}
        okButtonProps={{ className: "text-black", type: "primary" }}
        cancelButtonProps={{ danger: true }}
      >
        <InputNumber
          className="w-full text-lg p-2"
          min={0}
          max={100}
          value={isAddPointsOpen ? addPt : minPt}
          onChange={(e) => {
            if (isAddPointsOpen) setaddpt(e);
            else setMinPt(e);
          }}
        />
      </Modal>

      {contextHolder}
    </>
  );
};

// <div
//   className={`flex flex-row justify-evenly flex-wrap text-white z-50 relative`}
// >
//   {adminStatus &&
//     !removeloading &&
//     !addingPointLoad &&
//     !removePointloading &&
//     !removetoggel &&
//     !addptToggle &&
//     !minPtToggle && (
//       <button
//         className="bg-neutral-500 rounded-md hover:bg-black hover:text-white font-semibold text-black p-2 mb-1"
//         onClick={toggleRemove}
//       >
//         REMOVE
//       </button>
//     )}

//   {adminStatus &&
//     !removetoggel &&
//     !addptToggle &&
//     !minPtToggle &&
//     !removeloading &&
//     !addingPointLoad &&
//     !removePointloading && (
//       <button className="bg-neutral-500  rounded-md hover:bg-black hover:text-white font-semibold text-black p-2 mb-1">
//         + POINTS
//       </button>
//     )}

//   {adminStatus &&
//     !removetoggel &&
//     !addptToggle &&
//     !minPtToggle &&
//     !removeloading &&
//     !addingPointLoad &&
//     !removePointloading && (
//       <button className="bg-neutral-500  rounded-md hover:bg-black hover:text-white font-semibold text-black p-2 mb-1">
//         - POINTS
//       </button>
//     )}
// </div>;
