import React, { createContext, useContext } from "react"
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react"
import { ethers } from "ethers"

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract("0x72DfFa54d65b47b9ECaE008AD7a4ffc2A3e7332b")

  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign",
  )
  const address = useAddress()
  const connect = useMetamask()

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, //owner
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ])

      console.log("Contract success", data)
    } catch (error) {
      console.log("Contract Failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns")

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString(),
      ),
      image: campaign.image,
      pId: i,
    }))

    return parsedCampaigns
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns()

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address,
    )

    return filteredCampaigns
  }

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", pId, {
      value: ethers.utils.parseEther(amount),
    })

    return data
  }

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", pId)
    const numberOfDonations = donations[0].length

    const parseDonations = []

    for (let i = 0; i < numberOfDonations; i++) {
      parseDonations.push({
        donator: donations[0][i],
        donations: ethers.utils.formatEther(donations[1][i].toString()),
      })
    }

    return parseDonations
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
        connect,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
