// import { activateCustomer, deactivateCustomer } from '../../services/adminServices';
// import { getAllCustomers } from '../../services/adminServices';

export const sanitizeData = (data, keysToBeIncluded, setCustomers) => {
    const keyMapping = {
        customer_id: "Customer ID",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
    };
    // const handleAction = async (customerId, isActive) => {
    //     try {
    //         if (isActive) {
    //             await deactivateCustomer(customerId);
    //         } else {
    //             await activateCustomer(customerId);
    //         }
    //         const updatedData = await getAllCustomers();
    //         if (updatedData && updatedData.content) {
    //             const sanitizedData = sanitizeData(updatedData, [
    //                 "customer_id",
    //                 "firstName",
    //                 "lastName",
    //                 "email",
    //                 "active"
    //             ], setCustomers);
    //             setCustomers(sanitizedData);
    //         } else {
    //             setCustomers([]);
    //         }
    //     } catch (error) {
    //         console.error("Error handling action:", error);
    //     }
    // };

    const sanitizedContent = data.content.map(customer => {
        const sanitizedCustomer = {};
        keysToBeIncluded.forEach(key => {
            if (key === "active") {
                sanitizedCustomer[keyMapping[key]] = customer[key] ? "Active" : "Inactive";
            } else if (customer[key] !== undefined) {
                sanitizedCustomer[keyMapping[key]] = customer[key];
            }
        });

        sanitizedCustomer['Action'] = (
            <button
                className="button"
                onClick={() => handleAction(customer.customer_id, customer.active)}
            >
                {customer.active ? 'Deactivate' : 'Activate'}
            </button>
        );

        return sanitizedCustomer;
    });

    return {
        ...data,
        content: sanitizedContent,
    };
};
export const sanitizeTransactionData = (data) => {
    const sanitizedContent = data.content.map(transaction => {
        const sanitizedTransaction = {
            id:0,
            senderAccount:"N/A"
        };
        Object.keys(transaction).forEach(key => {
            if (key === "senderAccount" || key === "receiverAccount") {
                sanitizedTransaction[key] = transaction[key].accountNumber;
            } else {
                sanitizedTransaction[key] = transaction[key];
            }
        });
        return sanitizedTransaction;
    });

    return {
        ...data,
        content: sanitizedContent,
    };
};