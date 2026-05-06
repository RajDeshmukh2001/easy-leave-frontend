import type { RequestResponse } from '@/types/request';
import { formatEnumLabel } from '@/utils/formateEnumLabel';
import React from 'react';
import TextareaField from './form/TextareaField';
import { Form, Formik } from 'formik';
import { Button } from './ui/button';

type RequestCardProps = {
  request: RequestResponse;
};

type FormValuesType = {
  managerRemark: string;
};

const initialValues: FormValuesType = {
  managerRemark: '',
};

function RequestCard({ request }: RequestCardProps): React.JSX.Element {
  const handleRequest = async (values: FormValuesType) => {
    console.log(values);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md ">
      <div className="flex flex-col gap-2 pb-4">
        <h2 className="text-xl font-bold text-card-foreground">{request.employeeName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <p>
            <span className="font-semibold">Type : </span>
            {formatEnumLabel(request.type)}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Duration : </span>
            {formatEnumLabel(request.duration)}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Applied Date : </span>
            {new Date(request.appliedDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Leave Date : </span>
            {new Date(request.date).toLocaleDateString()}
          </p>
          {request.leaveCategory && (
            <p>
              <span className="font-semibold text-gray-800">Category : </span>
              {request.leaveCategory}
            </p>
          )}
        </div>

        <div className="mt-2 flex flex-col">
          <p className="font-semibold text-gray-800 mb-1 text-sm">Description : </p>
          <p className="text-sm text-gray-600 leading-relaxed">{request.description}</p>
        </div>
      </div>

      <hr />

      <div className="pt-4">
        <Formik initialValues={initialValues} onSubmit={handleRequest}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <TextareaField
                name="managerRemark"
                id="managerRemark"
                label="Remark"
                placeholder="Add a remark"
              />

              <div className="flex items-center justify-end gap-4">
                <Button
                  type="submit"
                  className="bg-(--technogise-blue) mb-0 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Approve
                </Button>

                <Button
                  type="submit"
                  variant="destructive"
                  className="mb-0 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Reject
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RequestCard;
