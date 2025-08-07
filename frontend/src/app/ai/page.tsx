"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useApi } from "@/hooks/useApi";
import { Bot, FileText, Download, Copy } from "lucide-react";

export default function AIPage() {
  const [disputeReason, setDisputeReason] = useState("");
  const [creditorName, setCreditorName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { apiCall } = useApi();

  const disputeReasons = [
    { value: "identity_theft", label: "Identity Theft" },
    { value: "not_mine", label: "Not My Account" },
    { value: "paid_in_full", label: "Paid in Full" },
    { value: "incorrect_amount", label: "Incorrect Amount" },
    { value: "outdated", label: "Outdated Information" },
    { value: "duplicate", label: "Duplicate Entry" },
    { value: "other", label: "Other" },
  ];

  const handleGenerateLetter = async () => {
    if (!disputeReason || !creditorName) return;

    setIsGenerating(true);
    try {
      const response = await apiCall("/ai/generate-letter", {
        method: "POST",
        body: JSON.stringify({
          disputeReason,
          creditorName,
          accountNumber,
        }),
      });

      if (response.success) {
        setGeneratedLetter(response.data.letter);
      }
    } catch (error) {
      // Fallback to mock response
      const mockLetter = generateMockLetter(
        disputeReason,
        creditorName,
        accountNumber
      );
      setGeneratedLetter(mockLetter);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockLetter = (
    reason: string,
    creditor: string,
    account: string
  ) => {
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const reasonText = {
      identity_theft:
        "This account was opened fraudulently and is the result of identity theft.",
      not_mine:
        "This account does not belong to me and I have no knowledge of its existence.",
      paid_in_full:
        "This account has been paid in full and should reflect a zero balance.",
      incorrect_amount:
        "The balance or payment history shown is incorrect and needs to be updated.",
      outdated:
        "This information is outdated and should be removed from my credit report.",
      duplicate:
        "This entry appears to be a duplicate of another account on my report.",
      other:
        "I am disputing this item due to inaccurate information on my credit report.",
    };

    return `${date}

[Your Name]
[Your Address]
[City, State, ZIP Code]

${creditor}
[Creditor Address]

Re: Dispute of Credit Report Information
Account Number: ${account || "N/A"}

Dear Credit Reporting Manager,

I am writing to formally dispute the following information on my credit report:

Creditor: ${creditor}
Account Number: ${account || "Not provided"}

${reasonText[reason as keyof typeof reasonText] || reasonText.other}

I am requesting that this item be investigated and removed from my credit report as it is inaccurate and negatively affecting my credit score. Under the Fair Credit Reporting Act (FCRA), I have the right to dispute inaccurate information on my credit report.

Please investigate this matter and provide me with written confirmation of the results of your investigation. If the information cannot be verified, please remove it from my credit report immediately.

I have enclosed copies of supporting documentation to assist in your investigation. Please contact me if you require any additional information.

Thank you for your prompt attention to this matter.

Sincerely,

[Your Signature]
[Your Printed Name]

Enclosures: Supporting Documentation`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadLetter = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `dispute-letter-${creditorName}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bot className="w-8 h-8 mr-3 text-blue-600" />
              AI Dispute Letter Generator
            </h1>
            <p className="text-gray-600 mt-2">
              Generate professional dispute letters with AI assistance
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Letter Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dispute Reason *
                  </label>
                  <Select
                    value={disputeReason}
                    onValueChange={setDisputeReason}
                    placeholder="Select dispute reason"
                    options={disputeReasons}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creditor Name *
                  </label>
                  <Input
                    value={creditorName}
                    onChange={(e) => setCreditorName(e.target.value)}
                    placeholder="e.g., Chase Bank, Capital One"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number (Optional)
                  </label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Last 4 digits recommended"
                  />
                </div>

                <Button
                  onClick={handleGenerateLetter}
                  disabled={!disputeReason || !creditorName || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Generate Letter
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  💡 Tips for Success
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be specific about the inaccurate information</li>
                  <li>• Keep records of all correspondence</li>
                  <li>• Send letters via certified mail</li>
                  <li>• Follow up within 30 days</li>
                </ul>
              </div>
            </Card>

            {/* Generated Letter */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Generated Letter
                </h2>
                {generatedLetter && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadLetter}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              {generatedLetter ? (
                <div className="bg-gray-50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {generatedLetter}
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center min-h-96 flex items-center justify-center">
                  <div>
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Fill out the form and click &quot;Generate Letter&quot; to
                      create your dispute letter
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="mt-8 p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start">
              <div className="text-yellow-600 text-sm">
                <strong>Legal Disclaimer:</strong> This AI-generated letter is
                for informational purposes only and should be reviewed by a
                legal professional before submission. We are not responsible for
                the outcome of disputes submitted using these letters.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
